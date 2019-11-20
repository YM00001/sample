let storage = window.localStorage || null;
let setStorage = function(key, obj) {
    if (!storage) {
        return false;
    }
    let res = storage[key] = JSON.stringify(obj);
    return true;
}

export default {
    methods: {
        getGuestDoc: (id) => {
            let key = `guest_doc_${id}`;
            if (storage && storage[key] && false) {
                let data = JSON.parse(storage[key]);
                return Promise.resolve(data);
            } else {
                return firebase.firestore().collection('guest_document').doc(id).get().then((doc) => {
                    let data = doc.data();
                    setStorage(key, data);
                    return data;
                });
            }
        },
    },
}
