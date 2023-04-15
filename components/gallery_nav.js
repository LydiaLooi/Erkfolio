import Link from "next/link";

export default function GalleryNavigation() {
    return (
        <div >
            <nav>
                <ul>
                    <li>
                        <Link href="/gallery">All Art</Link>
                    </li>
                    <li>
                        <Link href="/gallery/digital">Digital Art</Link>
                    </li>
                    <li>
                        <Link href="/gallery/traditional">Traditional Art</Link>
                    </li>
                    <li>
                        <Link href="/gallery/misc">Misc.</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}