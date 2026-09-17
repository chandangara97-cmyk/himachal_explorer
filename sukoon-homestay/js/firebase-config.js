/* ============================================================
   FIREBASE CONFIG — reuse the same project as Himachal Explorer
   (garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app)

   Paste the SAME config object you already use on
   himachalexplorer.in (find it in index.html or yui.html on that
   site — it's the firebaseConfig block passed to initializeApp).
   ============================================================ */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "garg-enterprise.firebaseapp.com",
  databaseURL: "https://garg-enterprise-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "garg-enterprise",
  storageBucket: "garg-enterprise.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

/* Blog posts live at: /kalpa_stay/blog_posts/{postId}
   Each post: { title, slug, excerpt, body, coverImage, date, published } */
const BLOG_PATH = "kalpa_stay/blog_posts";
