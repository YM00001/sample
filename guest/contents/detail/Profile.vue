<template>
<div>
    <table>
        <tr v-for="(item, key) in profile">
            <th>{{ key }}</th>
            <td>{{ item }}</td>
        </tr>
    </table>
</div>
</template>

<script>
export default {
    data() {
        return {
            profile: {
                '出身地': '熊本です',
                '血液型': 'O型です',
                '職業': '大学生です',
                '年齢': '18歳です',
                'スリーサイズ': 'B80:W58:H88',
                '身長': '168cm',
                'カップ': 'Bカップです',
                'タバコ': '吸いません',
                '好きなアーティストは?': '長渕剛、矢沢永吉',
                '好きなスポーツは?': 'クリケット',
                '学生のコロなにしてた?': 'コロナ飲んでた',
                '初体験は?': 'まだ',
                '将来の夢は?': 'パイロット',
                '犬派?猫派?': '猫派',
                '誰に似てるって言われる?': 'Leonardo da Vinci',
                '休みのひなにしてる？': '電車でGO',
                '好きな食べ物は?': 'ソウルフード',
                'お酒は好き?': '大好き',
                'お客様に一言！': '素敵な出会いになりますことを心からお祈りするとともに、貴殿のますますの反映を期待しております。',
                'さらに一言！': 'あんたバカァ？もういい加減終わりんいしようぜ',
            },
        }
    },
}
</script>

<style scoped>
tr {
    border-color: var(--cl-border-light);
}

tr:nth-child(2n) {
    background-color: var(--cl-grey-light);
}

th {
    color: var(--cl-pink);
    width: 40%;
    padding: 0 1rem 0 2rem;
    vertical-align: middle;
    text-align: left;
}

td {
    width: 60%;
    font-size: 1.2rem;
    text-align: left;
    padding: 1rem 1rem;
}
</style>
