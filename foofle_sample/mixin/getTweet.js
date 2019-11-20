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
        getTweet: (id) => {
            let key = `tweet_${id}`;
            if (storage && storage[key] && false) {
                let data = JSON.parse(storage[key]);
                if (storage[`favorite_${id}`]) {
                    data.is_favorite = true;
                } else {
                    data.is_favorite = false;
                }
                return Promise.resolve(data);
            } else {
                return firebase.firestore().collection('tweet').doc(id).get().then((doc) => {
                    let data = doc.data();
                    data.type = 'tweet';
                    if (storage && storage[`favorite_${id}`]) {
                        data.is_favorite = true;
                    } else {
                        data.is_favorite = false;
                    }
                    setStorage(key, data);
                    return data;
                });
            }
        },
        getReview: (id) => {
            let key = `review_${id}`;
            if (storage && storage[key] && false) {
                let data = JSON.parse(storage[key]);
                if (storage[`favorite_review_${id}`]) {
                    data.is_favorite = true;
                } else {
                    data.is_favorite = false;
                }
                return Promise.resolve(data);
            } else {
                return firebase.firestore().collection('review').doc(id).get().then((doc) => {
                    let data = doc.data();
                    data.type = 'review';
                    if (storage && storage[`favorite_review_${id}`]) {
                        data.is_favorite = true;
                    } else {
                        data.is_favorite = false;
                    }
                    setStorage(key, data);
                    return data;
                });
            }
        },
        setFavorite: (id) => {
            let key = `favorite_${id}`;
            return setStorage(key, id);
        },
        setReviewFavorite: (id) => {
            let key = `favorite_review_${id}`;
            return setStorage(key, id);
        },
    },
}
