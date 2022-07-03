import SEO from "@components/seo";
import Wrapper from "@layout/wrapper";
import Header from "@layout/header/header-01";
import Footer from "@layout/footer/footer-01";
import HeroArea from "@containers/hero/layout-06";

import ExploreProductArea from "@containers/explore-product/layout-02";

import ServiceArea from "@containers/services/layout-01";
import { normalizedData } from "@utils/methods";

// Demo data
import homepageData from "../data/homepages/home-06.json";
import productData from "../data/products.json";


export async function getStaticProps() {
    return { props: { className: "template-color-1" } };
}

const Home = () => {
    const content = normalizedData(homepageData?.content || []);
    

    return (
        <Wrapper>
            <SEO pageTitle="GameVerse - NFT" />
            <Header />
            <main id="main-content">
                <HeroArea data={content["hero-section"]} />
                <ExploreProductArea
                    data={{
                        ...content["explore-product-section"],
                        products: productData,
                        placeBid: true,
                    }}
                />
                <ServiceArea data={content["service-section"]} />
            </main>
            <Footer />
        </Wrapper>
    );
};

export default Home;
