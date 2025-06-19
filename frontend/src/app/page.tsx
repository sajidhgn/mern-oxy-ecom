import React from "react";
import BackgroundSection from "@/components/BackgroundSection/BackgroundSection";
import SectionHero2 from "@/components/SectionHero/SectionHero2";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import SectionSliderCategories from "@/components/SectionSliderCategories/SectionSliderCategories";
import SectionClientSay from "@/components/SectionClientSay/SectionClientSay";
import Heading from "@/components/Heading/Heading";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { PRODUCTS, SPORT_PRODUCTS } from "@/data/data";
import SectionMagazine5 from "@/app/blog/SectionMagazine5";

function PageHome() {
  return (
    <div className="ox-PageHome relative overflow-hidden">
      <SectionHero2 />
      <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
        <SectionSliderCategories />
        <SectionSliderProductCard
          data={[
            PRODUCTS[4],
            SPORT_PRODUCTS[5],
            PRODUCTS[7],
            SPORT_PRODUCTS[1],
            PRODUCTS[6],
          ]}
        />

        <SectionSliderProductCard
          heading="Best Sellers"
          subHeading="Best selling of the month"
        />

        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div>
            <Heading rightDescText="From the Ciseco blog">
              The latest news
            </Heading>
            <SectionMagazine5 />
            <div className="flex mt-16 justify-center">
              <ButtonSecondary>Show all blog articles</ButtonSecondary>
            </div>
          </div>
        </div>
        <SectionClientSay />
      </div>
    </div>
  );
}

export default PageHome;
