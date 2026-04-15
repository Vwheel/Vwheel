/* 2. app.js (SUBSTITUI TUDO) */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const config = { apiKey: "AIzaSyAz4coRINN6JbCyDpNEIm0C_Rdyk6mE-qw", authDomain: "vempire-e74c8.firebaseapp.com", projectId: "vempire-e74c8", storageBucket: "vempire-e74c8.firebasestorage.app", messagingSenderId: "411369926533", appId: "1:411369926533:web:a1b2c3d4e5f6g7h8i9j0k1" };

const app = initializeApp(config); const auth = getAuth(app); const db = getFirestore(app);
setPersistence(auth, browserLocalPersistence);

onAuthStateChanged(auth, async (user) => {
    const loader = document.getElementById('loading-screen');
    const appEl = document.getElementById('app-section');
    const loginEl = document.getElementById('login-section');

    if (user) {
        if(loader) loader.classList.add('hidden');
        if(loginEl) loginEl.classList.add('hidden');
        if(appEl) appEl.classList.remove('hidden');

        let DB = { calendar: {} };
        const snap = await getDoc(doc(db, "users", user.uid));
        if(snap.exists()) DB = snap.data();

        const grid = document.getElementById('cal-grid'); grid.innerHTML = "";
        for(let i=1; i<=31; i++) {
            const d = document.createElement('div');
            d.style.cssText = "aspect-ratio:1; background:#161a22; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:800; border:1px solid #333; color:#fff; cursor:pointer;";
            d.innerText = i;
            if(DB.calendar[i]) d.style.borderColor = "#3b82f6";
            
            d.onclick = () => {
                const dayData = DB.calendar[i] || { start: '', end: '' };
                document.getElementById('km-start').value = dayData.start;
                document.getElementById('km-end').value = dayData.end;
                document.getElementById('lbl-date').innerText = `Dia ${i} de Abril`;
                document.getElementById('modal-day').classList.remove('hidden');

                document.getElementById('btn-save').onclick = async () => {
                    const s = parseFloat(document.getElementById('km-start').value) || 0;
                    const e = parseFloat(document.getElementById('km-end').value) || 0;
                    const t = e > s ? e - s : 0;
                    DB.calendar[i] = { start: s, end: e, total: t };
                    await setDoc(doc(db, "users", user.uid), DB);
                    alert(`✅ GRAVADO!\n\nRESUMO DO DIA:\nDISTÂNCIA: ${t} km`);
                    document.getElementById('modal-day').classList.add('hidden');
                    d.style.borderColor = "#3b82f6";
                };
            };
            grid.appendChild(d);
        }
    } else {
        if(loader) loader.classList.add('hidden');
        if(appEl) appEl.classList.add('hidden');
        if(loginEl) loginEl.classList.remove('hidden');
    }
});

document.getElementById('btn-login').onclick = () => {
    const email = document.getElementById('l-email').value;
    const pass = document.getElementById('l-password').value;
    signInWithEmailAndPassword(auth, email, pass).catch(e => alert("Erro ao entrar."));
};
