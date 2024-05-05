// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, getDocs, doc, addDoc, setDoc, updateDoc, query, orderBy, limit, where, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ1jIfcGIrXaVKin6ee7pQ_KsE3r0K5DE",
    authDomain: "udhaar-f2428.firebaseapp.com",
    projectId: "udhaar-f2428",
    storageBucket: "udhaar-f2428.appspot.com",
    messagingSenderId: "385759629335",
    appId: "1:385759629335:web:db254575d8156ffb6c4c52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const payeesRef = collection(db, 'payees');
const expenseRef = collection(db, 'expense');
const invoicesRef = collection(db, 'invoices');
const companyRef = collection(db, 'company');

// Get a list of payees from your database

const getPayees = async () => {
    let payees = []

    const payeesSnapshot = await getDocs(payeesRef);

    payeesSnapshot.docs.map(async (doc, index) => {

        const u = await getUdhaar(doc.id)
        payees.push({ id: doc.id, ...doc.data(), udhaar: u })
        
    });
    // console.log(payees)
    return payees;
}

const getPayeeById = async (id) => {
    const docSnap = await getDoc(doc(db, "payees", id));
    return docSnap.data()
}

const addPayee = async (content) => {
    const docRef = await addDoc(payeesRef, content);
    return docRef
}

const updatePayee = async (id, content) => {
    const upd = await updateDoc(doc(db, 'payees', id), content)
    return upd
}

const addUdhaar = async (id, content) => {
    // db.collection('users').doc(user).collection(‘tasks’).add({id: this.id, name: this.name, date: this.date })
    // const docSnap = await getDoc(doc(db, "payees", id));
    // console.log(docSnap, content)
    const udh = doc(db, "payees", id, "udhaar", content);
    /*const udh = await addDoc(doc(db, "payees", id), {
      amount: content.amount,
      date: content.date
    });*/
    return udh
}

const getUdhaar = async (id) => {

    let u = { total: 0, data: [] }
    const query = await getDocs(collection(db, "payees", id, "udhaar"));

    query.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        u.data.push({ id, ...doc.data() })
        u.total += doc.data().amount
    });
    return u
}

const getUdhaarTransact = async (id) => {
    let u = { total: 0, udhaar: [] }
    const p = await getPayeeById(id)
    const query = await getDocs(collection(db, "payees", id, "udhaar"));
    query.forEach(async (doc, index) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        let ent = { ...p, id, ...doc.data(), transaction: [] }
        const t = await getTransactions(id, doc.id)
        ent.transaction.push(t)
        u.udhaar.push(ent)
        u.total += doc.data().amount
        // u.tt += t.amount
    });
    return u
}

const addTransaction = async (id, payload) => {
    console.log("firebase ->", id, payload)

    const docRef = doc(db, "payees", id)
    console.log(docRef)
    // payeeRef.update({transactions: firebase.firestore.FieldValue.arrayUnion(payload)})
    /*const upd = await updateDoc(doc(db, 'payees', id), {
        pending: payload.pending,
        transactions: arrayUnion({ amount: payload.amount, duedate: payload.duedate, paydate: payload.paydate })
    });*/
    return upd
}

const getTransactions = async (pId, uId) => {
    // var payeeRef = doc(db, 'payees', id);
    let t = []
    const query = await getDocs(collection(db, "payees", pId, "udhaar", uId, "transaction"));
    query.forEach(doc => {
        // console.log(doc.id, doc.data())
        t.push(doc.data())
    })
    // console.log(query)
    return t
}


const getExpense = async () => {
    let exp = []

    const expSnapshot = await getDocs(expenseRef);

    expSnapshot.docs.map(doc => {
        exp.push({ id: doc.id, ...doc.data() })
    });
    // console.log(exp)
    return exp;
}

const addExpense = async (content) => {
    const docRef = await addDoc(expenseRef, content);
    return docRef
}


const getInvoices = async (content) => {
    const inv = []
    const q = query(invoicesRef, orderBy("date", "desc"));
    const invSnapshot = await getDocs(q)
    // const invSnapshot = await getDocs(invoicesRef)
    // console.log(q)

    // var collectionRef = firebase.firestore().collection('invoices');

    invSnapshot.docs.map(doc => {
        inv.push({ id: doc.id, ...doc.data() })
    })
    return inv
}

const addInvoice = async (content) => {
    const invRef = await addDoc(invoicesRef, content);
    return invRef
}

const getCompanies = async (content) => {
    const comp = []
    const q = query(companyRef, orderBy("company"));
    const snapShot = await getDocs(q)

    snapShot.docs.map(doc => {
        comp.push({ id: doc.id, ...doc.data() })
    })

    return comp;
}

const addCompany = async (content) => {
    const compRef = await addDoc(companyRef, content);
    return compRef
}
const updateCompany = async (id, content) => {
    const compRef = await updateDoc(doc(db, 'company', id), content)
    return compRef
}

const auth = getAuth();
export {
    db,
    addPayee,
    getPayees,
    getPayeeById,
    updatePayee,
    addUdhaar,
    addTransaction,
    getUdhaarTransact,
    getTransactions,
    getExpense,
    addExpense,
    getInvoices,
    addInvoice,
    auth,
    getCompanies,
    addCompany,
    updateCompany
}