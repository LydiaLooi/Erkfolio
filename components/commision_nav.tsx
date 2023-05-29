import Link from "next/link";

export default function CommissionNavigation() {
    return (
        <div >
            <nav>
                <ul>
                    <li>
                        <Link href="/commissions">Prices + Samples</Link>
                    </li>
                    <li>
                        <Link href="/commissions/tos">Terms of Services</Link>
                    </li>
                    <li>
                        <Link href="/commissions/inquire">Inquire</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}