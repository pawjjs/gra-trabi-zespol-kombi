<script setup>
import { computed, reactive, ref } from 'vue';
import validator from 'validator';

import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword  } from '@firebase/auth';
import { getFirestore , getDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

import InputField from './InputField.vue';

import './form.css';

const props = defineProps({
  type: { type: String, default: 'L' },
});
const isRegister = computed(() => props.type === 'R');

const nick = ref('');
const email = ref('');
const password = ref('');

const errors = ref({});

/*const form = reactive({
  nick: '',
  email: '',
  avatar: null,
  password: '',
  passwordRepeat: '',
});*/

/*
function validate() 
{
  const e = {};
  if (isRegister.value && form.nick.trim().length < 3) 
  {
    e.nick = 'Nazwa musi mieć co najmniej 3 znaki';
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    e.email = 'Podaj poprawny adres e-mail';
  }
  if (isRegister.value) 
  {
    if (form.password.length < 6)
    {
      e.password = 'Hasło musi mieć co najmniej 6 znaków';
    }
    if (form.password !== form.passwordRepeat)
    {
      e.passwordRepeat = 'Hasła nie są takie same';
    }
    if (form.avatar && !form.avatar.type.startsWith('image/'))
    {
      e.avatar = 'Avatar musi być obrazem';
    }
  } 
  else if (!form.password) 
  {
    e.password = 'Podaj hasło';
  }
  return e;
}

*/

const handleSubmitRegister = async (e) =>
{
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
      const invalid = 'invalid';
      //errors.value.emailError = invalid;
      //setEmailError(invalid);
      throw 'Invalid email';
    }
    if (!validator.isStrongPassword(password.value))
    {
        //setStrengh('none');
      throw 'Password not strong enought';
    }
    const auth = getAuth(); 
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = auth.currentUser;
    if (user) 
    {
      const res = await fetch('/api/firebase-config');
      const firebaseApp = initializeApp(await res.json());
      const db = getFirestore(firebaseApp);
      console.log(db);

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
    //if (file !== undefined) {
    //    const fileReF = ref(storage, `Avatars/${file_id}`)
    //    uploadBytes(fileReF, imageUpload)
    //      .then(() => {
    //        console.log('UPLOADED FILE');
    //      });
    //  }

    console.log("Register Succes UwU");
  } 
  catch (error) 
  {
    console.info({ error });
  }
}

const handleSubmitLogin = async (e) => 
{
  console.log("login");
  //console.log('LOGOWANIE', { email: form.email.trim(), password: '***' });
}

</script>

<template>
  <div class="auth">
    <h2 class="form-label">{{ isRegister ? 'Register' : 'Login' }}</h2>
    <div v-if="isRegister">
      <form enctype='multipart/form-data' novalidate @submit.prevent="handleSubmitRegister">
        <input type="text" placeholder="Nick" 
          v-model="nick"
        />
        <input type="email" placeholder="Email" 
          v-model="email"
        />
        <!--<small v-model="errors">{{ errors.validator?.errorEmail }}</small>-->
        <input type="password" placeholder="****" 
          v-model="password"
        />
        <button type="submit">Sign up</button>
      </form>
    </div>
    <!--//////////////////////////////////////////////////////////////////////////////////////////////-->
    <div v-else>
      <form novalidate @submit.prevent="handleSubmitLogin">
        <button type="submit">Sign in</button>
      </form>
    </div>

  
    <nav>
      <RouterLink v-if="isRegister" to="/login">Log in</RouterLink>
      <RouterLink v-else to="/register">Create an account</RouterLink>
    </nav>
  </div>
</template>



<!--<InputField
        v-model="form.nick"
        label-name="Username"
        autocomplete="username"
        :error="errors.nick"
      />
      <InputField
        v-model="form.email"
        label-name="E-mail"
        type="email"
        autocomplete="email"
        :error="errors.email"
      />
      <InputField
        v-if="isRegister"
        v-model="form.avatar"
        label-name="Avatar"
        type="file"
        accept="image/*"
        small="Opcjonalnie"
        :error="errors.avatar"
      />
      <InputField
        v-model="form.password"
        label-name="Hasło"
        type="password"
        :autocomplete="isRegister ? 'new-password' : 'current-password'"
        :small="isRegister ? 'Minimum 6 znaków' : undefined"
        :error="errors.password"
      />
      <InputField
        v-if="isRegister"
        v-model="form.passwordRepeat"
        label-name="Powtórz hasło"
        type="password"
        autocomplete="new-password"
        :error="errors.passwordRepeat"
      />
      -->