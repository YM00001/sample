<template>
    <footer>
        <div class="footer-container">
            <p class="sitename">FOOFLE</p>
            <ul>
                <li><a>無料店舗登録</a></li>
                <li><a>お問い合わせ</a></li>
                <li><a>店舗様ログイン</a></li>
                <li><a>運営者情報</a></li>
                <li><a></a></li>
            </ul>
        </div>
        <p class="copy">&copy; 2019- FOOFLE</p>
    </footer>
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

    footer {
        color: #FFF;
        width: 100%;
        background-color: #3d4054;
        margin-top: 3rem;
        padding: 2rem 0 0.5rem
    }

    footer p,
    footer a {
        color: #FFF;
    }

    footer .sitename {
        font-size: 20px;
        letter-spacing: 9px;
        font-weight: 800;
        margin: 0;
    }

    footer .footer-container {
        padding: 0 5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    
    footer li {
        margin-bottom: 0.5rem;
    }

    footer .copy {
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
    }
</style>

<style>
    body {
        padding-bottom: 0;
    }
</style>
