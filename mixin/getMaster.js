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
        checkQuery: function(str, tag) {
            return !str || tag.match(str);
        },
        getStations: (query_obj) => {
            let key = 'master_stations';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let col = firebase.firestore().collection('station');
                if (query_obj) {
                    for (let key in query_obj) {
                        col = col.where(key, '==', query_obj[key]);
                    }
                }
                return col.get().then((res) => {
                    let data = [];
                    res.forEach((item) => {
                        data.push(item.data());
                    });
                    setStorage(key, data);
                    return data;
                });
            }
        },
        getStationsFilterByState: (state) => {
            let key = `master_stations_fb_${state}`;
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let col = firebase.firestore().collection('station').where('state', '==', state);
                return col.get().then((res) => {
                    let data = [];
                    res.forEach((item) => {
                        data.push(item.data());
                    });
                    setStorage(key, data);
                    return data;
                });
            }
        },
        getAreas: (query_obj) => {
            let key = 'master_areas';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let col = firebase.firestore().collection('area');
                if (query_obj) {
                    for (let key in query_obj) {
                        col = col.where(key, '==', query_obj[key]);
                    }
                }
                if (query_obj && query_obj.hasOwnProperty('is_special')) {
                    return col.get().then((res) => {
                        let data = [];
                        res.forEach((item) => {
                            data.push(item.data());
                        });
                        setStorage(key, data);
                        return data;
                    });
                } else {
                    return col.orderBy('is_special', 'desc').get().then((res) => {
                        let data = [];
                        res.forEach((item) => {
                            data.push(item.data());
                        });
                        setStorage(key, data);
                        return data;
                    });
                }
            }
        },
        getState: () => {
            let key = 'master_state';
            if (storage && storage[key] && false) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('state');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getPlayOptions: () => {
            let key = 'master_play_options';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('options');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getServiceCategory: () => {
            let key = 'master_service_category';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('service_category');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getServiceGenre: () => {
            let key = 'master_service_genre';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('service_genre');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getDeliveryType: () => {
            let key = 'master_delivery_type';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('delivery_type');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getGuestReviewBadCategory: () => {
            let key = 'master_guest_review_bad_category';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('guest_review_bad_category');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getProfileQuestion: () => {
            let key = 'master_profile_question';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('profile_question');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
        getPopularTag: () => {
            let key = 'master_popular_tag';
            if (storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                return firebase.firestore().collection('tag').where('is_popular', '==', true).get().then((qss) => {
                    let data = [];
                    qss.forEach((item) => {
                        data.push(item.data());
                    });
                    setStorage(key, data);
                    return data;
                });
            }
        },
        getNotPopularTag: () => {
            let key = 'master_not_popular_tag';
            if (false && storage && storage[key]) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                return firebase.firestore().collection('tag').where('is_popular', '==', false).get().then((qss) => {
                    let data = [];
                    qss.forEach((item) => {
                        data.push(item.data());
                    });
                    setStorage(key, data);
                    return data;
                });
            }
        },
        getCancelReason: () => {
            let key = 'master_cancel_reason_code';
            if (storage && storage[key] && false) {
                return Promise.resolve(JSON.parse(storage[key]));
            } else {
                let docref = firebase.firestore().collection('master').doc('cancel_reason_code');
                return docref.get().then((res) => {
                    setStorage(key, res.data());
                    return res.data();
                });
            }
        },
    },
}
