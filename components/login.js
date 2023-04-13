import { signInWithGoogle } from "../lib/firebase";

const Login = () => {
    return (
        <div>
            <button onClick={signInWithGoogle}>
                Sign in with Google :eyes:
            </button>
        </div>
    )
}

export default Login;