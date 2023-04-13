function ArtGallery({ artData }) {
    return (
        <section>
            <div className="wrapper">
                <div className="gallery">

                    {artData.map(({ name, url }) => (
                        <Image
                            key={url}
                            src={url}
                            height={500}
                            width={500}
                            alt={name}
                        />
                    ))}

                </div>
            </div>
        </section>
    )
}