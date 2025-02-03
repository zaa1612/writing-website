// Import Firebase SDK yang diperlukan
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfy7y-e1YkZZapYNBAiopgvzBYVD6b91Q",
  authDomain: "writing-web-41418.firebaseapp.com",
  projectId: "writing-web-41418",
  storageBucket: "writing-web-41418.appspot.com",
  messagingSenderId: "753928140108",
  appId: "1:753928140108:web:1b44c7d40e06e85aae4be9",
  measurementId: "G-SKR3PRB0F0"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Fungsi untuk menampilkan tulisan terbaru di halaman utama
async function loadLatestPosts() {
    const postsList = document.getElementById("posts-list");
    postsList.innerHTML = ""; // Kosongkan sebelum menampilkan data

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(5));

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement("div");
            postElement.classList.add("post-item");

            postElement.innerHTML = `
                <div class="post-card">
                    <p>${post.content}</p>
                    <small>Posted on ${new Date(post.timestamp.seconds * 1000).toLocaleString()}</small>
                </div>
            `;

            postsList.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Fungsi untuk menulis dan menyimpan tulisan baru
async function submitPost(content) {
    try {
        await addDoc(collection(db, "posts"), {
            content: content,
            timestamp: serverTimestamp() // Menyimpan waktu saat post dibuat
        });
        alert("Tulisan berhasil diposting!");
        loadLatestPosts(); // Perbarui daftar tulisan setelah posting
    } catch (error) {
        console.error("Error posting:", error);
    }
}

// Fungsi Login
function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("Logged in:", user);
        })
        .catch(error => {
            console.error("Error logging in:", error);
        });
}

// Fungsi Registrasi
function register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("Registered:", user);
        })
        .catch(error => {
            console.error("Error registering:", error);
        });
}

// Memuat tulisan terbaru saat halaman utama dibuka
window.onload = loadLatestPosts;

