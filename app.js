import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const config = { 
    apiKey: "AIzaSyAz4coRINN6JbCyDpNEIm0C_Rdyk6mE-qw", 
    authDomain: "vempire-e74c8.firebaseapp.com", 
    projectId: "vempire-e74c8", 
    storageBucket: "vempire-e74c8.firebasestorage.app", 
    messagingSenderId: "411369926533", 
    appId: "1:411369926533:web:a1b2c3d4e5f6g7h8i9j0k1" 
};

const app = initializeApp(config); 
const auth = getAuth(app); 
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, async (user) => {
    const loading = document.getElementById('loading-screen');
    const appSection = document.getElementById('app-section');
    
    if (user) {
        if(loading) loading.style.display = 'none';
        if(appSection) appSection.style.display = 'block';
        
        let DB = { calendar: {} };
        const snap = await getDoc(doc(db, "users", user.uid));
        if(snap.exists()) DB = snap.data();
        
        const grid = document.getElementById('cal-grid');
        grid.innerHTML = "";
        for(let i=1; i<=31; i++) {
            const day = document.createElement('div');
            day.style.cssText = "aspect-ratio:1; background:#161a22; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; border:1px solid #333; cursor:pointer;";
            day.innerText = i;
            if(DB.calendar[i]) day.style.borderColor = "#3b82f6";
            
            day.onclick = () => {
                const data = DB.calendar[i] || { start: '', end: '' };
                document.getElementById('km-start').value = data.start;
                document.getElementById('km-end').value = data.end;
                document.getElementById('lbl-date').innerText = "Dia " + i + " de Abril";
                document.getElementById('modal-day').style.display = 'flex';
                
                document.getElementById('btn-save').onclick = async () => {
                    const s = parseFloat(document.getElementById('km-start').value) || 0;
                    const e = parseFloat(document.getElementById('km-end').value) || 0;
                    const t = e > s ? e - s : 0;
                    DB.calendar[i] = { start: s, end: e, total: t };
                    await setDoc(doc(db, "users", user.uid), DB);
                    alert(`✅ GRAVADO!\n\nRESUMO DO DIA:\nDISTÂNCIA: ${t} km`);
                    document.getElementById('modal-day').style.display = 'none';
                    day.style.borderColor = "#3b82f6";
                };
            };
            grid.appendChild(day);
        }
    } else {
        // Redireciona para login se necessário
        if(loading) loading.style.display = 'none';
        alert("Sessão expirada. Faz login no Vwheel.");
    }
});
