<script setup>
import { computed, reactive, ref, watch, onMounted , watchEffect} from 'vue';
import { useRouter } from 'vue-router';
import validator from 'validator';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword  } from '@firebase/auth';
import { getFirestore , getDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

import { useFirebase } from '../../store/firebase.js';
import InputField from './InputField.vue';
import './form.css';

const props = defineProps
({
  type: { type: String, default: 'L' },
});
const router = useRouter();
const isRegister = computed(() => props.type === 'R');

const nick = ref('');
const email = ref('');
const password = ref('');

const firebase = useFirebase();


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
    const form = e.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    //TODO : Add avatar file from MongoDB
    const response = await fetch('/api/firebase/register', 
    {
      method: form.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values), 
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) 
    {
      throw data.message || response.statusText;
    }
    console.log("Register Success");
  } 
  catch (error) 
  {
    const message = (error.message) ? error.message : error;
    toastNotify(message);
  }
}

const handleSubmitLogin = async (e) => {
  e.preventDefault();
  //const jsonResponse = await useApiRequest('POST', '/siema', { x: 8 })
  //.catch(() => { /* toast przy błędzie */ }) 
  try 
  {
    ////await firebase.login('ryangosling@ether.lord','QweasD_77*');
    const form = e.target;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const email = values.form_email;
    const password = values.form_password;

    console.log('uwu1'+firebase.user.uid);
    await firebase.login(email ,password);
    console.log('uwu2'+firebase.user.uid);

    


    /*const response = await fetch('/api/firebase/login', 
    {
      method: form.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values), 
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) 
    {
      throw data.message || response.statusText;
    }*/
    //console.log("Login Success");
    //router.push('/home');
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
      <form method="POST" enctype='multipart/form-data' novalidate @submit.prevent="handleSubmitRegister">
        <InputField label-name="Nickname" small="Glory to Mankind">
          <template #body>
            <input 
              type="text" 
              name="form_nick"
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
            name="form_password"
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
      <form method="POST" novalidate @submit.prevent="handleSubmitLogin">
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
              name="form_password"
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