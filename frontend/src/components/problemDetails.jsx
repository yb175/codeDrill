import AccordionItem from '../assets/AccordationItem';
import ProblemDetails from '../sections/problemDetailFormAdmin/problemDetails';
import ProblemDescription from '../sections/problemDetailFormAdmin/description';
import TestCasesSection from '../sections/problemDetailFormAdmin/testCaseSection';
import BoilerplateSection from '../sections/problemDetailFormAdmin/boilerplate';
export default function ProblemDetailsForm() {
  return (
    <>
     <ProblemDetails />

      <ProblemDescription/>

      <TestCasesSection/>
      
      <BoilerplateSection/>
    </>
  );
}