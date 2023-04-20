import { signInWithGoogle } from "../scripts/firebase";

export default function Login() {
    return (
        <div>
            <button className='cool-button centred' onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </div>
    )
}
