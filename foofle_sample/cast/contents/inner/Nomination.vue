<template>
    <div class="ff-nomination-list" v-if="nomination">
        <div class="nomination-thumnail">
            <img src="/img/guest/sample11.png" alt="">
        </div>
        <div class="nomination-body">
            <div class="nomination-header">
                <span class="header-name">{{ nomination.guest_name }}</span><span class="nomination-info">お客様がキャストを探しています</span><span class="header-date">2019年7月10日</span>
            </div>
            <div class="nomination-content">
                <table class="nomination-table">
                    <tr>
                        <th>利用場所</th>
                        <td>{{ nomination.delivery_area ? nomination.delivery_area.name + '駅' : '指定なし' }}</td>
                    </tr>
                    <tr>
                        <th>キャスト</th>
                        <td>{{ nomination.year_min ? nomination.year_min + '歳' : '指定なし' }}～{{ nomination.year_max ? nomination.year_max + '歳' : '指定なし' }}</td>
                    </tr>
                    <tr>
                        <th>予算</th>
                        <td>{{ nomination.fee_max ? nomination.fee_max + '円以内' : '指定なし' }}</td>
                    </tr>
                </table>
            </div>
            <div class="nomination_footer">
                <div class="nomination-icon favorite">
                    <fa :icon="['far', 'heart']"></fa><span>20</span>
                </div>
                <p class="offer-btn"
                    :class="{ 'disabled': disabled || clicking }"
                    @click="submitNomination(nomination.id)"
                >
                    お誘いOK
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            clicking: false,
        }
    },
    props: [
        'nomination', 'disabled',
    ],
    methods: {
        showLightbox: function(imgs, ind) {
            this.$eventHub.$emit('lightbox', imgs);
        },
        submitNomination: function(id) {
            this.clicking = true;
            this.$emit('clickNomination', id);
        },
    },
}
</script>

<style scoped>

.nomination-body {
    width: 100%;
}

.ff-nomination-list {
    width: 100%;
    display: flex;
    padding: 1rem 0.5rem 0.5rem;
    border-style: solid;
    border-color: #EEE;
    border-width: 1px 0;
    background-color: #FFF;

    --cl-text: #555;
    --cl-text-grey: #AAA;
}

.ff-nomination-list,
.ff-nomination-list p
.ff-nomination-list span {

}

.nomination-thumnail {
    padding: 0 0.5rem 0 0;
}

.nomination-thumnail img {
    width: 4rem;
    border-radius: 100vw;
}

.nomination-header {
    max-width: 100%;
    margin-bottom: 0.5rem;
}

.header-name {
    color: #555;
    font-weight: 600;
    max-width: 100%;
    padding-right: 0.5rem;
    text-overflow: ellipsis;
    font-family: sans-serif;
}

.header-id {
    max-width: 100%;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cl-text-grey);
    font-family: sans-serif;
}

.header-date {
    max-width: 100%;
    padding-right: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--cl-text-grey);
}

.nomination-content {
    margin-bottom: 0.5rem;
}

.nomination-content p {
    font-size: 1.1rem;
    line-height: 1.3rem;
    font-family: sans-serif;
}

.nomination_footer {
    display: flex;
    width: 100%;
    max-width: 320px;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}

.nomination-icon {
    font-family: 'M plus 1P';
    color: var(--cl-text-grey);
    line-height: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 2rem;
}

.nomination-icon span {
    margin-left: 0.5rem;
}

.nomination-content {
    padding: 0.5rem 0;
}

.offer-btn {
    color: #FFF;
    background: #FFBAC3;
    background: var(--cl-grad);
    padding: 0.3rem 1rem;
    border-radius: 3rem;
}

.offer-btn:hover {
    cursor: pointer;
}

.offer-btn.disabled {
    color: #FFF;
    background: var(--cl-grey);
}

.nomination-table {

}

.nomination-table th,
.nomination-table td {
    font-size: 1.1rem;
    line-height: 1.3rem;
    font-family: sans-serif;
}

.nomination-table th {
    text-align: left;
    padding-right: 1rem;
}

.nomination-info {
    color: #FFF;
    background: var(--cl-pink);
    width: 100%;
    padding: 0 0.2rem;
    margin-right: 0.3rem;
}
</style>
