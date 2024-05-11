import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { auth, db, storage } from './config'
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { isDifferenceInRange } from '../helpers'
import emailjs from '@emailjs/browser';

export async function createNewUser(userData){
    const userRef = collection(db, "users")
    let errorMsg = null

    try {
        const newUser = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        )

        if (!newUser){
            errorMsg = "Error creating user"

            return {isError: true, errorMsg, isSuccess: false}
        } 

        const user = {
            id: newUser.user.uid,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            dob: userData?.dob?.split("-")[0],
            religon: userData?.religon
        }

       await setDoc(doc(userRef, user.id), user)

       return {isSuccess: true, isError: false, errorMsg}

    } catch (error) {
        console.log(error)
        errorMsg = error
        return {isError:true, errorMsg, isSuccess: false}
    }
}

export async function signInUser(email, password){
    let errorMsg = null
    try {
        const user = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )

        if(!user) {
            errorMsg = "Error signing in user"

            return {isError: true, errorMsg, isSuccess: false}
        }

        return {isSuccess: true, isError: false, errorMsg}
    } catch (error) {
        console.log(error)
        errorMsg = error
        return {isError:true, errorMsg, isSuccess: false}
    }
}

export async function getCurrentUser(){
    const userRef = collection(db, "users")
    let userData = null

    const handleGetDocs = new Promise((resolve, reject) => {

        auth.onAuthStateChanged(async (currentUser) => {
            if(currentUser){
                const userDoc = doc(userRef, currentUser.uid)
    
                userData = await getDoc(userDoc)
                
                resolve(userData)
            }
    
        })
    })

    userData = await handleGetDocs

    return userData
}

export async function uploadApartmentDetails(apartmentData){
    const apartmentRef = collection(db,"apartments")

    try {
        
        const storageRef = ref(storage, "images/apartments/" + apartmentData.imgFile.name + Date.now())
        
        const uploadImage = await uploadBytes(storageRef, apartmentData.imgFile)
        
        if(!uploadImage) return;
        
        const getImageUrl = await getDownloadURL(storageRef)
        
        const apartmentOb = {
            apartmentType: apartmentData.apartmentType,
            roomsNo: apartmentData.roomsNo,
            rent: apartmentData.rent,
            units: apartmentData.units,
            description: apartmentData.description,
            imgUrl: getImageUrl,
            createdAt: new Date()
        }
        const apartment = await addDoc(apartmentRef, apartmentOb)

        return apartment
    } catch (error) {
        console.log(error)
    }
}

export async function getApartments(){
    const apartmentsRef = collection(db, "apartments")

    const q = query(
        apartmentsRef,
        orderBy("createdAt","desc")
    )

    try {
        const querySnapShot = await getDocs(q)

        if(!querySnapShot) return;

        const returnData = querySnapShot.docs.map((doc) => {

            return {...doc.data(), id: doc.id}
        })

        return returnData

    } catch (error) {
        console.error(error)
    }
}

export async function handleSignOut(){
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error)
    }
}

export async function handleApartmentMatching(apartmentId){
    const apartmentsRef = collection(db, "apartments")

    const apartmentDoc = doc(apartmentsRef, apartmentId)

    try {
        const apartmentSnapShot = await getDoc(apartmentDoc)
    
        const apartmentIsmatching = apartmentSnapShot.data()?.isMatching

        return {apartmentIsmatching, apartmentDoc}
    } catch (error) {
        console.error(error)
    }

}

export async function getMatched(userData){
    const toMatchedRef = collection(db, "apartments/" + userData.apartmentId + "/toMatched")

    const refinedData = {
        userId: userData.userId,
        createdAt: new Date()
    }

    const matchedRef = collection(db, "matched")

    const q = query(
        matchedRef,
        where("apartmentId","==",userData.apartmentId)
    )

    try {
        const querySnapShot = await getDocs(toMatchedRef)

        if(!querySnapShot) return;

        if(querySnapShot.empty){
            const {apartmentIsmatching, apartmentDoc} = await handleApartmentMatching(userData.apartmentId)

            if(apartmentIsmatching){
                await updateDoc(apartmentDoc, {isMatching: [...apartmentIsmatching, userData.userId]})
            }else{
                await updateDoc(apartmentDoc, {isMatching: [userData.userId]})
            }

            await addDoc(toMatchedRef, refinedData)

            return;
        }

        let matched = false;


        for( const doc_ of querySnapShot.docs){
            const docData = doc_.data()

            const usersRef = collection(db, "users")

            const userDoc = doc(usersRef, docData.userId)

            const userSnapShot = await getDoc(userDoc)

            const userData_ = userSnapShot.data()

            const isDobInRange = isDifferenceInRange(userData.dob, userData_.dob)

            let checkIfMatched;
            const matchedSnapShot = await getDocs(q)

            if(matchedSnapShot.empty){
                checkIfMatched = false
            } else{
                for (const docMatched of matchedSnapShot.docs){
                    const matchedData = docMatched.data()

                    if(matchedData.usersId.includes(userData_.id)){
                        checkIfMatched = true
                    }
                }
            }   

            if(
                userData.gender == userData_.gender && userData.religon == userData_.religon &&  isDobInRange && userData.userId != userData_.id && !checkIfMatched
            ){
                const matchedRef = collection(db, "matched")

                await addDoc(matchedRef, {usersId: [userData.userId, userSnapShot.id], apartmentId: userData.apartmentId})

                const {apartmentIsmatching, apartmentDoc} = await handleApartmentMatching(userData.apartmentId)

                if(apartmentIsmatching){
                    await updateDoc(apartmentDoc, {units: userData.units - 1, isMatching: [...apartmentIsmatching, userData.userId]})
                }else{
                    await updateDoc(apartmentDoc, {units: userData.units - 1, isMatching: [userData.userId]})
                }

                const send_person1 = {
                    to_name: userData.name,
                    to_email: userData.email,
                    message: `You have been matched with ${userData_.name} with email ${userData_.email} for an apartment`
                }
                const send_person2 = {
                    to_name: userData_.name,
                    to_email: userData_.email,
                    message: `You have been matched with ${userData.name} with email ${userData.email} for an apartment`
                }

                await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, send_person1, import.meta.env.VITE_EMAILJS_USER_ID)
                await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, send_person2, import.meta.env.VITE_EMAILJS_USER_ID)
                

                matched = true

                break;
            }
        }

        if(!matched){
            const {apartmentIsmatching, apartmentDoc} = await handleApartmentMatching(userData.apartmentId)

            await updateDoc(apartmentDoc, {isMatching: [...apartmentIsmatching, userData.userId]})

            await addDoc(toMatchedRef, refinedData)
        }
        return matched

    } catch (error) {
        console.error(error)
    }
}

export async function updateUserProfile(updates){
    const usersRef = collection(db, "users")

    const userDoc = doc(usersRef,updates.id)

    const userData = {
        name: updates.name,
        email: updates.email,
        dob: updates.dob,
        religon: updates.religon,
        gender: updates.gender
    }

    try {
        await updateDoc(userDoc, userData)
    } catch (error) {
        console.error(error)
    }
}

export async function updateApartment(apartmentData, apartmentId){
    const apartmentsRef = collection(db, "apartments")

    const apartmentDoc = doc(apartmentsRef, apartmentId)

    try {
        await updateDoc(apartmentDoc, apartmentData)
    } catch (error) {
        console.error(error)
    }
}