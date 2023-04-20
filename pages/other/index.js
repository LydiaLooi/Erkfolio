import Head from 'next/head';
import Layout from '../../components/layout';

import { useState } from 'react';
import ProjectGallery from '../../components/project_gallery';
import { getLogger } from '../../logging/log-util';
import utilStyles from '../../styles/utils.module.css';
const logger = getLogger("gallery-home")


export default function OtherProjectsHome() {
    const heading = "Other Projects"

    const [projectData, setProjectData] = useState([])


    return (
        <div>
            <Layout>
                <Head>
                    <title>{heading}</title>
                </Head>
                <h2 className={utilStyles.underline}>Other Projects</h2>
                <div className={utilStyles.paddingX15px}>
                    <p>This section is to showcase my artwork that can be grouped under a 'project' or something similar.</p><p>Click on a project to see more details about it, along with the project's gallery.</p>
                </div>
            </Layout>
            <ProjectGallery projectData={projectData} projectDataUpdateMethod={setProjectData} />
        </div>
    );
}