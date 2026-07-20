import { db } from '../config/firebase';
import { collection, doc, addDoc, updateDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const collectionRef = collection(db, 'tipos_servicio');

export const tipoServicioService = {
 
  async getAll() {
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    return await addDoc(collectionRef, {
      ...data,
      creado: serverTimestamp(),
      actualizado: serverTimestamp()
    });
  },

  async update(id, data) {
    const docRef = doc(db, 'tipos_servicio', id);
    await updateDoc(docRef, {
      ...data,
      actualizado: serverTimestamp()
    });
  }
};