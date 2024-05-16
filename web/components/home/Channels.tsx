import { Center, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import ReportImage from "@/public/report.jpg";
import BulletinImage from "@/public/bulletin.jpg";
import MissionImage from "@/public/mission.jpg";
import Channel from "./Channel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Channels = () => {
  const channels = [
    { path: "/report", src: ReportImage.src, alt: "Report" },
    { path: "/board", src: BulletinImage.src, alt: "Board" },
    { path: "/mission", src: MissionImage.src, alt: "Mission" },
  ];

  const isCarousel = useBreakpointValue({ base: true, md: false });

  if (isCarousel) {
    return (
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {channels.map((channel, index) => (
          <SwiperSlide key={index}>
            <Center p={8} m={8}>
              <Channel {...channel} />
            </Center>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <SimpleGrid my={4} columns={3} gap={4} p={4} w={"80%"}>
      {channels.map((channel, index) => {
        return <Channel key={index} {...channel} />;
      })}
    </SimpleGrid>
  );
};

export default Channels;
