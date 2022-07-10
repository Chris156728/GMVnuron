import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { motion } from "framer-motion";
import SectionTitle from "@components/section-title/layout-02";
import Product from "@components/product/layout-01";
import Button from "@ui/button";
import FilterButtons from "@components/filter-buttons";
import { flatDeep } from "@utils/methods";
import { SectionTitleType, ProductType } from "@utils/types";
import SliderTrack from "@ui/input-range/slider-track";

const ExploreProductArea = ({ className, space, data, domint }) => {
    //console.log(data.url);
    let filterProds = data?.products;
    const filters = [
        ...new Set(
            flatDeep(data?.products.map((item) => item.categories) || [])
        ),
    ];
    const [products, setProducts] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    useEffect(() => {
        const currentProducts = data.products.slice(0, 10);
        setProducts(currentProducts);
        setHasMore(currentProducts.length < data.products.length);
    }, [data?.products]);

    const loadMoreHandler = () => {
        const currentProducts = filterProds.slice(0, products.length + 4);
        setProducts(currentProducts);
        setHasMore(currentProducts.length < filterProds.length);
    };

    const filterHandler = (filterKey) => {
        const prods = data?.products ? [...data.products] : [];
        if (filterKey === "all") {
            filterProds =data?.products;
            const currentProducts = filterProds.slice(0, 10);
            setProducts(currentProducts);
            setHasMore(currentProducts.length < filterProds.length);
            return;
        }
        filterProds = prods.filter((prod) =>
            prod.categories.includes(filterKey)
        );
        const currentProducts = filterProds.slice(0, 10);
        setHasMore(currentProducts.length < filterProds.length);
        setProducts(currentProducts);
        //setProducts(filterProds);
    };
    return (
        <div
            className={clsx(
                "rn-product-area masonary-wrapper-activation",
                space === 1 && "rn-section-gapTop",
                className
            )}
        >
            <div className="container">
                <div className="row align-items-center mb--60">
                    <div className="col-lg-4">
                        {data?.section_title && (
                            <SectionTitle
                                className="mb--0"
                                disableAnimation
                                {...data.section_title}
                            />
                        )}
                    </div>
                    <div className="col-lg-8">
                        <FilterButtons
                            buttons={filters}
                            filterHandler={filterHandler}
                        />
                    </div>
                </div>
                <div className="col-lg-12">
                    <motion.div layout className="isotope-list item-5">
                        {products.map((prod) => (
                            <motion.div
                                key={prod.id}
                                className={clsx("grid-item")}
                                layout
                            >
                                <Product
                                    placeBid={!!data.placeBid}
                                    title={prod.title}
                                    slug={prod.slug}
                                    latestBid={prod.latestBid}
                                    price={prod.price}
                                    likeCount={prod.likeCount}
                                    image={prod.images?.[0]}
                                    authors={prod.authors}
                                    bitCount={prod.bitCount}
                                    tkuri={prod.tkuri}
                                    pid={prod.pid}
                                    domint={domint}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="view-more-btn mt--50">
                            <Button
                                color="primary-alta"
                                className={!hasMore ? "disabled" : ""}
                                fullwidth
                                onClick={loadMoreHandler}
                            >
                                {hasMore ? (
                                    <>View More Items</>
                                ) : (
                                    <>No More Items</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

ExploreProductArea.propTypes = {
    className: PropTypes.string,
    space: PropTypes.oneOf([1, 2]),
    data: PropTypes.shape({
        section_title: SectionTitleType,
        products: PropTypes.arrayOf(ProductType),
        placeBid: PropTypes.bool,
        
    }),
};

ExploreProductArea.defaultProps = {
    space: 1,
};

export default ExploreProductArea;
