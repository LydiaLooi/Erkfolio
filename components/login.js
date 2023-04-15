import { signInWithGoogle } from "../scripts/firebase";

const Login = () => {
    return (
        <div>
            <button className='cool-button centred' onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </div>
    )
}

export default Login;