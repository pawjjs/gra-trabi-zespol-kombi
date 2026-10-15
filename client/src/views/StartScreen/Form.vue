<script setup>
import { computed, reactive, ref, watch, onMounted , watchEffect} from 'vue';
import validator from 'validator';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword  } from '@firebase/auth';
import { getFirestore , getDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

import InputField from './InputField.vue';
import './form.css';

const props = defineProps
({
  type: { type: String, default: 'L' },
});
const isRegister = computed(() => props.type === 'R');

const nick = ref('');
const email = ref('');
const password = ref('');

const errors = reactive({
  emailValid : '',
  isPasswordStrong: ''
  //TODO: make file validation
});

const toastNotify = (textArgument) => {
  toast(textArgument,
  {
    autoClose: 1500,
    type: 'warning',
    theme: "dark",
    position: "bottom-center", 
    transition: "slide"
  }); 
}
////////////////////////
const authXD = ref({
    user: null,
    loading: true
});

const fetchAuth = async () => {
    authXD.value.loading = true;
    try 
    {
        const response = await fetch('/api/firebase-auth');
        if (!response.ok) 
        {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        authXD.value.user = data.user;
        authXD.value.loading = false;
    } catch (err) {
        console.log(err);
    }
};

// Wykonaj po zamontowaniu komponentu
onMounted(() => {
    fetchAuth();
});

// Reakcja na zmianę użytkownika
watch(
    () => authXD.value.user,
    (newUser, oldUser) => {
        console.log('Poprzedni użytkownik:', oldUser);
        console.log('Nowy użytkownik:', newUser);
    }
);

// Automatycznie reaguje na użyte wewnątrz zależności
watchEffect(() => {
    console.log('Stan użytkownika:', authXD.value.user);
});
////////////////////////


/*
TODO: Implement file input handler
***React Version***

const handleFileAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.split('/')[0] === 'image') {
        setImageUpload(event.target.files[0]);
        setInputImageStyle('inp-file-style form-control');
      } else {
        setInputImageStyle('inp-file-style-ERROR form-control');
        setImageUpload('File Validate Error');
      }
    }
}*/

const handleSubmitRegister = async (e) =>{
  e.preventDefault();
  try 
  {
    if(!nick.value || !email.value || !password.value)
    {
      throw 'Fill up all fields';
    }
    if (nick.value.length < 6) {
      throw 'Nickname too short';
    }
    if(nick.value.length > 20){
      throw 'Nickname too long';
    }
    if (!validator.isEmail(email.value)) {
      const invalid = 'Invalid email';
      errors.emailValid = invalid;
      throw invalid;
    }
    errors.emailValid = '';
    if (!validator.isStrongPassword(password.value))
    {
      const invalid = 'Password not strong enought';
      errors.isPasswordStrong = invalid;
      throw invalid
    }
    errors.isPasswordStrong = '';
    //backend
    const auth = getAuth(); 
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = auth.currentUser;
    if (user) 
    {
      const res = await fetch('/api/firebase-config');
      const firebaseApp = initializeApp(await res.json());
      const db = getFirestore(firebaseApp);
      await setDoc(doc(db, 'Users', user.uid),
      {
        email: user.email,
        playerNick: nick.value,
        //avatar: file_id,
        online: true,
        assigned: '',
        ping: serverTimestamp()
      });
    }
    //backend

    //TODO : Add avatar file from MongoDB

    console.log("Register Succes");
  } 
  catch (error) 
  {
    const message = (error.message) ? error.message : error;
    toastNotify(message);
  }
}
const handleSubmitLogin = async (e) => {
  e.preventDefault();
  try 
  {
    //backend
    const auth = getAuth(); 
    await signInWithEmailAndPassword(auth, email.value, password.value);
    const res = await fetch('/api/firebase-config');
    const firebaseApp = initializeApp(await res.json());
    const db = getFirestore(firebaseApp);
    const UserRef = doc(db, 'Users', auth.currentUser.uid);
    const UserSnap = await getDoc(UserRef);
    if (UserSnap.exists()) {
      await updateDoc(UserRef, {
        online: true
      })
    }
    //backend
    console.log("Login Success");
  } 
  catch (error) 
  {
    toastNotify(error);
  }
}



</script>

<template>
  <div class="auth">
    <h2 class="form-label">{{ isRegister ? 'Register' : 'Login' }}</h2>
    <div v-if="isRegister">
      <form enctype='multipart/form-data' novalidate @submit.prevent="handleSubmitRegister">
        <InputField label-name="Nickname" small="Glory to Mankind">
          <template #body>
            <input 
              type="text" 
              placeholder="Enter you name" 
              v-model="nick"
            />
          </template>
        </InputField>
        <InputField label-name="Email" :error="errors.emailValid">
        <template #body>
          <input
            type="email"
            name="form_email"
            placeholder="Enter address email"
            v-model="email"
          />
        </template>
      </InputField>
      <!--
      <InputField>
        *** Image File Handle ***

        React version
        <InputField labelName='Avatar'
                body={
                  <input
                    type='file'
                    name='form_avatar'
                    className={inputImageStyle}
                    onChange={handleFileAvatar}
                  />
                }
              />
      </InputField>
      -->
      <InputField label-name="Password" :error="errors.isPasswordStrong">
        <template #body>
          <input 
            type="password" 
            placeholder="********" 
            v-model="password"
          />
        </template>
      </InputField>
      <button type="submit">Sign up</button>
      </form>
    </div>
    <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
    <div v-else>
      <form novalidate @submit.prevent="handleSubmitLogin">
          <InputField label-name="Email" >
          <template #body>
            <input
              type="email"
              name="form_email"
              placeholder="Enter address email"
              v-model="email"
            />
          </template>
        </InputField>

        <InputField label-name="Password">
          <template #body>
            <input 
              type="password" 
              placeholder="********" 
              v-model="password"
            />
          </template>
        </InputField>
        <button type="submit">Sign in</button>
      </form>
    </div>

    <nav>
      <RouterLink v-if="isRegister" to="/login">Log in</RouterLink>
      <RouterLink v-else to="/register">Create an account</RouterLink>
    </nav>
  </div>
</template>