<template>
    <header>
        <h1>FOOFLE</h1>
        <ul>
            <li><a>無料店舗登録</a></li>
            <li><a>お問い合わせ</a></li>
            <li><a>店舗様ログイン</a></li>
        </ul>
    </header>
</template>

<script>
export default {
    data() {
        return {

        }
    },
}
</script>

<style scoped>

        header {
            width: 100%;
            height: 48px;
            background: #FFF;
            padding: 0 2rem;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
        }

        header h1 {
            color: #000;
            font-size: 20px;
            letter-spacing: 9px;
            font-weight: 800;
            margin: 0;
        }

        header ul {
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
        }

        header li {
            padding: 0 1rem;
            word-break: keep-all;
        }

        header li a {
            font-size: 0.9rem;
        }
</style>

<style>
    body {
        padding-top: 48px;
    }
</style>
