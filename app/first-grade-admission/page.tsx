'use client';

import { Banner } from '@/components/shared/banner';
import { Container } from '@/components/shared/container';
import { Pdf } from '@/components/shared/pdf';

export default function FirstGradeAdmission() {
  return (
    <>
      <Banner
        image="/background.jpg"
        title={'О приеме в первый класс'}
        className="mb-8"
      />
      <Container className="px-4 py-8">
        <div className="flex flex-col md:flex-row justify-center">
          <Pdf
            url="https://drive.google.com/file/d/1CxkJraRiXCrTRLeYTrDoiZzT7nBc6Ytx/preview"
            className="w-full h-[90vh]"
          ></Pdf>

          <Pdf
            url="https://docs.google.com/forms/d/e/1FAIpQLScrHFOs8o50S-lKyRe3f-3XBUrihkswzK8IdjdgBXPriHbwSg/viewform"
            className="w-full h-[90vh]"
          ></Pdf>
        </div>
      </Container>
    </>
  );
}
