/* 2. NOME DO FICHEIRO: app.js */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const config = { apiKey: "AIzaSyAz4coRINN6JbCyDpNEIm0C_Rdyk6mE-qw", authDomain: "vempire-e74c8.firebaseapp.com", projectId: "vempire-e74c8", storageBucket: "vempire-e74c8.firebasestorage.app", messagingSenderId: "411369926533", appId: "1:411369926533:web:a1b2c3d4e5f6g7h8i9j0k1" };
const app = initializeApp(config); const auth = getAuth(app); const db = getFirestore(app);
let DB = { calendar: {} }; let activeDay = null;

onAuthStateChanged(auth, async (u) => {
    if (u) {
        const s = await getDoc(doc(db, "users", u.uid));
        if(s.exists()) DB = s.data();
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        render();
    } else { alert("Faz login para continuar."); }
});

function render() {
    const g = document.getElementById('cal-grid'); g.innerHTML = "";
    for(let i=1; i<=30; i++) {
        const d = document.createElement('div');
        d.style.cssText = "aspect-ratio:1; background:#161a22; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; border:1px solid #333;";
        d.innerText = i;
        if(DB.calendar[i]) d.style.borderColor = "#3b82f6";
        d.onclick = () => { activeDay = i; openModal(i); }; g.appendChild(d);
    }
}

function openModal(i) {
    const data = DB.calendar[i] || { start: '', end: '' };
    document.getElementById('km-start').value = data.start;
    document.getElementById('km-end').value = data.end;
    document.getElementById('lbl-date').innerText = "Dia " + i + " de Abril";
    document.getElementById('modal-day').style.display = 'flex';
}

document.getElementById('btn-save').onclick = async () => {
    const s = parseFloat(document.getElementById('km-start').value) || 0;
    const e = parseFloat(document.getElementById('km-end').value) || 0;
    const t = e > s ? e - s : 0;
    DB.calendar[activeDay] = { start: s, end: e, total: t };
    await setDoc(doc(db, "users", auth.currentUser.uid), DB);
    alert(`✅ GRAVADO COM SUCESSO!\n\nRESUMO DO DIA:\nDISTÂNCIA: ${t} km`);
    document.getElementById('modal-day').style.display = 'none'; render();
};
