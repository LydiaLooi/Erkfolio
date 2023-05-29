import Link from "next/link";
import utilStyles from "../styles/utils.module.css"

export default function TermsOfServicesInfo() {
    return (
        <div className={utilStyles.paddingX15px}>
            <h3>Table of contents</h3>
            <ul>
                <li><a href="#scope">Scope of Work</a></li>
                <li><a href="#ordering">Ordering a Commission</a></li>
                <ul>
                    <li><a href="#turnaround">Turnaround Time</a></li>
                </ul>
                <li><a href="#pricing">Pricing and Payment</a></li>
                <ul>
                    <li><a href="#refunds">Refunds and Cancellations</a></li>
                </ul>
                <li><a href="#revisions">Revisions and Modifications</a></li>
                <li><a href="#communication">Communication and Client Responsibilities</a></li>
                <li><a href="#delivery">Delivery and Deadlines</a></li>
                <li><a href="#attribution">Attribution and Watermarks</a></li>
                <li><a href="#rights">Rights and Ownership + Copyright and Intellectual Property</a></li>
                <li><a href="#agreement">Agreement of Terms of Service</a></li>
            </ul>
            <h3 id="scope">Scope of Work</h3>
            <ul>
                <li>I specialise in digital illustrations focused on character artwork. Please note that I do not accept the following types of orders</li>
                <ul>
                    <li><small>NSFW (Not Safe for Work) content.</small></li>
                    <li><small>Depictions of real-life people, including celebrities, yourself, or friends/relatives.</small></li>
                    <li><small>Graphic design work, such as logos, web/branding/UI/UX design, etc.</small></li>
                </ul>
                <li>If your request does not fall into the above categories, it is likely acceptable. If you are unsure, feel free to contact me about it.</li>
                <li>If you are unsure whether your request falls into any of the above categories, it can be discussed further.</li>
                <li>I reserve the right to decline commissions at my discretion.</li>
            </ul>



            <h3 id="ordering">Ordering a Commission</h3>
            <ul>
                <li>Commissions can be requested through Discord direct message, Instagram direct message, or email, in order of my preference.</li>
                <li>To place an order, please provide a clear description of your requirements.</li>
                <li>Include reference images or examples to convey the desired pose, expression, clothing, and background (if applicable).</li>
                <li>Please provide visual references for your characters whenever possible. If not provided, there may be an additional cost for character design.</li>
                <li>If the commission is within my <a href="#scope">Scope of Work</a>, an estimate for the commission will be provided. Upon agreeing on the pricing, you will be sent an invoice through PayPal.</li>
            </ul>


            <h4 id="turnaround">Turnaround Time</h4>
            <ul>
                <li>Upon payment of the invoice, your order will be added to a queue. I will notify you once I have begun working on your commission.</li>
                <li>The expected turnaround time for completing the commission is up to 2 weeks. However, please note that this is an estimate and may vary depending on the complexity of the artwork and the current workload.</li>
                <li>In the event of any delays or changes to the turnaround time due to personal matters or unforeseen circumstances, I will inform you as soon as possible to provide an updated timeframe.</li>
            </ul>
            <p>If you would like to add a deadline to your order, please include this information in your commission request. Please note that accommodating specific deadlines may result in additional costs to prioritise your order accordingly.</p>



            <h3 id="pricing">Pricing and Payment</h3>
            <ul>
                <li>The approximate pricing for commissions can be found in the <Link href="/commissions">Prices + Samples</Link> section.</li>
                <li>Note that all prices are in USD unless discussed otherwise.</li>
                <li>The final pricing will depend on the complexity of the requested illustration and will be confirmed with you before accepting the commission.</li>
                <li>Payment is expected to be fulfilled within 48 hours of invoice delivery.</li>
            </ul>


            <h4 id="refunds">Refunds and Cancellations</h4>
            <ul>
                <li>During the sketch or lineart stage, you may request a refund if you are unsatisfied with the progress or in case of financial difficulties. The maximum refund amount will be half of the payment made. No refunds can be requested after these stages.</li>
                <li>If, for any reason, I am unable to complete your commission, you will receive a full refund.</li>
                <li>Commissions are non-refundable once the work is complete.</li>
            </ul>


            <h3 id="revisions">Revisions and Modifications</h3>
            <ul>
                <li>I can accommodate edits during the sketch and lineart stages.</li>
                <li>Examples of acceptable edits include changing elements of the illustration, such as the pose or expression. Up to three edits are included.</li>
                <li>Work-in-progress shots will be provided for your review.</li>
                <li>Any additional edits requested after the lineart stage will incur an additional fee of $5 USD per edit.</li>
            </ul>

            <h3 id="communication">Communication and Client Responsibilities</h3>
            <ul>
                <li>It is expected that the client will be available on the chosen platform (Discord, Instagram, Email) and respond within 24 hours (unless otherwise discussed) to review work-in-progress sketches and lineart.</li>
                <li>If the client does not reply within the specified time frame, it will be assumed that the work for review has been accepted, and progress on the commission will continue accordingly.</li>
            </ul>

            <h3 id="delivery">Delivery and Deadlines</h3>
            <ul>
                <li>Upon completion, you will receive the final artwork as a high-resolution PNG file. </li>
                <li>Additionally, if applicable, a high-resolution transparent PNG file (without background) will be provided.</li>
                <li>Delivery of the digital files will be via Google Drive.</li>
            </ul>

            <h3 id="attribution">Attribution and Watermarks</h3>
            <ul>
                <li>All commissioned works will include a non-intrusive signature located in the corner of the artwork.</li>
                <li>When reposting or sharing the commissioned work, the client agrees not to crop out, alter, or remove the signature in any way.</li>
                <li>If the client prefers a version of the artwork without the signature, please indicate this in your commission request to initiate a discussion regarding the feasibility and potential adjustments.</li>
            </ul>

            <h3 id="rights">Rights and Ownership + Copyright and Intellectual Property</h3>
            <ul>
                <li>As the client, you are allowed to use the finished artwork for personal, non-commercial purposes. For instance, you can print it, use it as a profile image or decoration on personal websites or social networks, or include it in personal articles.</li>
                <li>Commercial usage of the artwork, such as merchandising, requires prior discussion and agreement with me regarding appropriate compensation.</li>
                <li>I will always credit you as the commissioner whenever the commissioned work is displayed.</li>
                <li>It is important to note that the commissioned work should not be altered, modified, or manipulated in any way after it is finished, either by the client or any third party, without explicit permission from me.</li>
                <ul>
                    <li>This includes, but is not limited to, refraining from feeding the commissioned artwork into an AI model or using it as a base for derivative works.</li>
                </ul>
                <li>I retain the rights to the original artwork and any unauthorised alterations or uses may infringe upon copyright and intellectual property rights.</li>
            </ul>
            <p>By respecting these guidelines, both the client and the artist ensure the integrity of the commissioned artwork and uphold the agreed-upon terms regarding its usage and distribution.</p>

            <h3 id="agreement">Agreement of Terms of Service</h3>
            <p><strong><i>By engaging in commission services, clients indicate their acceptance and agreement to the above terms.</i></strong> To inquire about a commission, check out the <Link href="/commissions/inquire">inquire page here</Link></p>

        </ div>
    )
}
