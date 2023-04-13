import '../styles/globals.css';
export default function App({ Component, pageProps }) {
    return (
        <>
            <Component {...pageProps} />
            <footer class="footer"><small>Copyright &copy; 2023 Erkfir. All Rights Reserved</small></footer>

        </>
    );
}
