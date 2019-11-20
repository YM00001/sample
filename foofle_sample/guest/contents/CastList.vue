<template>
<div class="ff-content">
    <ul>
        <li class="ff-list-girl"
            v-for="(cast, index) in list"
        >
            <div class="ff-list-girl-wrap">
                <router-link :to="`/${cast.id}`">
                    <div class="ff-list-girl-main-img">
                        <img src="/img/sales/sample11.png" alt="">
                        <div class="ff-list-girl-rank sprite ff-icon-crown-bg">
                            <p class="ff-at-rank-1">1</p>
                        </div>
                        <div class="ff-list-girl-img-icon">
                            <i class="sprite ff-icon-soon-red"></i>
                        </div>
                    </div>
                    <div class="ff-list-girl-detail">
                        <div class="ff-list-girl-sub-img">
                            <img src="/img/sales/sample43.png" alt="">
                            <img src="/img/sales/sample43.png" alt="">
                        </div>
                        <div class="ff-list-girl-detail-name">
                            <h2>{{ cast.id }}<span>(18)</span></h2>
                            <i class="ff-at-newhire"></i>
                            <p class="ff-list-girl-detail-cup">C</p>
                        </div>
                        <div class="ff-list-girl-detail-info">
                            <div class="ff-list-girl-detail-price">
                                <i class="ff-at-service-icon-soft"></i>
                                <p><span class="ff-dc-emphasis">30</span>分<span class="ff-dc-emphasis">7000</span>円</p>
                            </div>
                            <div class="ff-list-girl-detail-sizedept">
                                <p class="ff-list-girl-detail-dept">新宿発</p>
                                <p class="ff-list-girl-detail-size">140/80/58/88</p>
                            </div>
                        </div>
                        <div class="ff-list-girl-detail-feature">
                            <ul>
                                <li>パイパン</li>
                                <li>処女</li>
                                <li>現役大学生</li>
                                <li>癒し系</li>
                            </ul>
                        </div>
                        <div class="ff-list-girl-detail-more">
                            <div class="ff-list-girl-detail-fav">
                                <i class="sprite ff-icon-heart-pink"></i>
                                <p>200</p>
                            </div>
                        </div>
                    </div>
                    <div class="ff-list-girl-detail-review">
                        <div class="ff-review-wrap">
                            <div class="ff-review-star ff-st-5">
                                <i></i><i></i><i></i><i></i><i></i>
                            </div>
                            <div class="ff-review-value">
                                5.0 (220)
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </li>
    </ul>
    <div class="ff-pagenation-wrap">
        <div class="ff-pagenation-block">
            <p class="ff-pagenation-text">次の20件</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
        }
    },
    computed: {
        is_empty: function() {
            return this.list.length ? true : false;
        },
    },
    created: function() {
        // some logic
        let self = this;
        firebase.firestore()
                .collection('cast')
                .get()
                .then((res) => {
                    res.forEach((doc) => {
                        console.log(doc.data());
                        console.log(self.list);
                        self.list.push(doc.data());
                    })
                }).catch((error) => {
                    console.log(error);
                });
    },

}
</script>

<style scoped>

</style>
