<template>
    <div class="">
        YESY
        <form class="" action="/" method="post">
            <input type="file" @change="change">
            <p @click="submit">送信</p>
        </form>
        <picture>
          <source srcset="https://storage.cloud.google.com/foofle_public01/0d941e8ce9779655e6d3627fbd2743fe48bd836b.webp?hl=ja" type="image/webp">
          <img src="https://storage.cloud.google.com/foofle_public01/5dc738a986265c95d80ff5334b78d7d9b03be0fc.jpg?hl=ja">
        </picture>
        <ul>
            <li v-for="item in spins">{{ item }}</li>
        </ul>
        <p>1 / {{ times }}</p>
    </div>
</template>

<script>
import axios from 'axios';

// Check Area/Station in some function
let matchAreaOrStation = (item) => {
    if (item.is_area) {
        return item.id == this.area_id;
    } else {
        return item.id == this.id;
    }
}

let checkMatchAreaOrStation = (arr, comp) => {
    return arr.some(item => {
        if (item.is_area) {
            return item.id == comp.area_id;
        } else {
            return item.id == comp.id;
        }
    })
}

export default {
    data() {
        return {
            uploadFile: null,
            spins: [],
            times: 0,
        }
    },
    created: function() { // todo all delete
        let mod = 129;
        let trys = 30

        let hit = Math.floor(Math.random() * mod);
        let times = 0;

        for (let i = 0; i < trys; i++) {
            let flg = true;
            let s = 0;
            while(flg) {
                s++;
                let some = Math.floor(Math.random() * mod);
                if (some === hit) {
                    flg = false;
                }
            }
            this.spins.push(s);
            times += s;
        }
        this.times = times / trys;
    },
    mounted: function() {
        /*
        let db = firebase.firestore();
        let increment = firebase.firestore.FieldValue.increment(1);
        db.collection('partner_account').doc('6538399c85a74996b56e').collection('cast')
        //.where('is_fixed', '==', false).get().then((qss) => {
        .get().then((qss)=> {
            qss.forEach((qds) => {
                console.log(qds.id);
            });
            console.log(qss.size);
        })
        */
        let arr = [
            {
                is_area: false,
                id: '9929',
            },
            {
                is_area: true,
                id: 1,
            }
        ];
        let comp = {
            id: 9929,
            area_id: '9929',
        };

        let flg = checkMatchAreaOrStation(arr, comp);
        console.log(flg);
        // console.log(firebase.auth().currentUser);
        let user = firebase.auth().currentUser;
        console.log(user);
        firebase.firestore().collection('guest').doc('LiHmY9RBznRyYGHpSarc9qMMwl02').collection('favorite').doc('0119092501f748ce916f').onSnapshot((dss) => {
            console.log(dss.data());
        });
    },
    methods: {
        change: function(e) {
            console.log(e);
            e.preventDefault();
            let files = e.target.files;
            this.uploadFile = files[0];
        },
        submit: function() {
            let fd = new FormData();
            fd.append('file', this.uploadFile);
            axios({
                method: 'POST',
                url: '/',
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                data: fd,
            }).then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log('ERR');
                console.log(err);
            });
        },
    }
}
</script>

<style scoped>
input[type="file"] {
    display: unset;
}

p {
    padding: 1rem;
    background-color: antiquewhite;
}
</style>
