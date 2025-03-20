"use client";

import { useState } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Color } from "../../../utils/Colors";
import { Constant, ApiEndpoints } from "../../../utils/ApiConst";

export default function HairTypeQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    hairTexture: "",
    hairThickness: "",
    hairPorosity: "",
    hairDensity: "",
    scalpOiliness: "",
    damageLevel: "",
    hairElasticity: "",
    hairLength: "",
    mainConcerns: [],
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: "Hair Texture",
      question: "How would you describe your hair texture?",
      field: "hairTexture",
      options: [
        { value: "straight", label: "Straight" },
        { value: "wavy", label: "Wavy" },
        { value: "curly", label: "Curly" },
        { value: "coily", label: "Coily/Kinky" },
      ],
    },
    {
      title: "Hair Thickness",
      question: "How thick are your individual hair strands?",
      field: "hairThickness",
      options: [
        { value: "fine", label: "Fine (thin strands)" },
        { value: "medium", label: "Medium" },
        { value: "coarse", label: "Coarse (thick strands)" },
      ],
    },
    {
      title: "Hair Porosity",
      question: "How does your hair absorb and retain moisture?",
      field: "hairPorosity",
      options: [
        { value: "low", label: "Low (takes a long time to get wet and dry)" },
        { value: "medium", label: "Medium (normal absorption)" },
        { value: "high", label: "High (gets wet quickly, dries quickly)" },
      ],
    },
    {
      title: "Hair Density",
      question: "How many hairs do you have per square inch on your scalp?",
      field: "hairDensity",
      options: [
        { value: "low", label: "Low (can easily see scalp)" },
        { value: "medium", label: "Medium (scalp somewhat visible)" },
        { value: "high", label: "High (difficult to see scalp)" },
      ],
    },
    {
      title: "Scalp Oiliness",
      question: "How would you describe your scalp's oil production?",
      field: "scalpOiliness",
      options: [
        { value: "dry", label: "Dry (rarely gets oily)" },
        { value: "normal", label: "Normal (gets oily after 2-3 days)" },
        { value: "oily", label: "Oily (gets greasy within a day)" },
        { value: "combination", label: "Combination (oily roots, dry ends)" },
      ],
    },
    {
      title: "Damage Level",
      question: "How damaged is your hair?",
      field: "damageLevel",
      options: [
        { value: "minimal", label: "Minimal (virgin or healthy hair)" },
        { value: "moderate", label: "Moderate (some split ends or dryness)" },
        { value: "severe", label: "Severe (breakage, split ends throughout)" },
        {
          value: "chemical",
          label: "Chemical damage (from coloring/processing)",
        },
      ],
    },
    {
      title: "Hair Elasticity",
      question:
        "How well does your hair return to its original state when stretched?",
      field: "hairElasticity",
      options: [
        { value: "low", label: "Low (breaks easily when stretched)" },
        { value: "medium", label: "Medium (stretches and mostly returns)" },
        { value: "high", label: "High (stretches and fully returns)" },
      ],
    },
    {
      title: "Hair Length",
      question: "What is your current hair length?",
      field: "hairLength",
      options: [
        { value: "short", label: "Short (above shoulders)" },
        { value: "medium", label: "Medium (shoulder to mid-back)" },
        { value: "long", label: "Long (below mid-back)" },
      ],
    },
    {
      title: "Main Concerns",
      question: "What are your main hair concerns? (Select up to 3)",
      field: "mainConcerns",
      multiSelect: true,
      options: [
        { value: "dryness", label: "Dryness" },
        { value: "frizz", label: "Frizz" },
        { value: "breakage", label: "Breakage" },
        { value: "dandruff", label: "Dandruff or scalp issues" },
        { value: "lackVolume", label: "Lack of volume" },
        { value: "tangles", label: "Tangling" },
        { value: "hairLoss", label: "Hair loss or thinning" },
        { value: "colorFading", label: "Color fading" },
        { value: "slowGrowth", label: "Slow growth" },
        { value: "oiliness", label: "Excessive oiliness" },
      ],
    },
  ];

  const handleMultiSelectChange = (value) => {
    const currentSelections = [...formData.mainConcerns];
    const valueIndex = currentSelections.indexOf(value);

    if (valueIndex === -1 && currentSelections.length < 3) {
      setFormData({
        ...formData,
        mainConcerns: [...currentSelections, value],
      });
    } else if (valueIndex !== -1) {
      currentSelections.splice(valueIndex, 1);
      setFormData({
        ...formData,
        mainConcerns: currentSelections,
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    const currentField = steps[currentStep].field;
    const currentValue = formData[currentField];

    if (
      !steps[currentStep].textArea &&
      !currentValue &&
      !steps[currentStep].multiSelect
    ) {
      toast.error("Please select an option before continuing.");
      return;
    }

    if (steps[currentStep].multiSelect && formData[currentField].length === 0) {
      toast.error("Please select at least one option.");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatData = () => {
    const getLabel = (field) => {
      const step = steps.find((s) => s.field === field);
      if (!step || !step.options) return formData[field];

      const option = step.options.find((o) => o.value === formData[field]);
      return option ? option.label : formData[field];
    };

    const formatConcerns = () => {
      if (!formData.mainConcerns || formData.mainConcerns.length === 0)
        return "";

      const concernLabels = formData.mainConcerns.map((concernValue) => {
        const concernStep = steps.find((s) => s.field === "mainConcerns");
        const concernOption = concernStep.options.find(
          (o) => o.value === concernValue
        );
        return concernOption ? concernOption.label : concernValue;
      });

      return concernLabels.join(", ");
    };

    return {
      hair_texture: getLabel("hairTexture"),
      hair_thickness: getLabel("hairThickness"),
      hair_porosity: getLabel("hairPorosity"),
      hair_density: getLabel("hairDensity"),
      scalp_oiliness: getLabel("scalpOiliness"),
      damage_level: getLabel("damageLevel"),
      hair_elasticity: getLabel("hairElasticity"),
      hair_length: getLabel("hairLength"),
      main_concerns: formatConcerns(),
    };
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formattedData = formatData();

      const response = await axios.post(
        `${Constant.baseURL}${ApiEndpoints.HAIR_TYPE}`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transformedResult = {
        primaryType: response.data.primary_hair_type,
        secondaryType: response.data.secondary_characteristics
          ? response.data.secondary_characteristics.join(", ")
          : "",
        concerns: response.data.main_concerns
          ? response.data.main_concerns.split(", ")
          : [],
        recommendations: {
          routine: response.data.recommendations.routine,
          ingredients: response.data.recommendations.ingredients,
          avoidIngredients: response.data.recommendations.avoidIngredients,
          lifestyleConsiderations:
            response.data.recommendations.lifestyleConsiderations,
        },
        hairTypeCode: response.data.hair_type_code,
      };

      setResult(transformedResult);
      toast.success(response.data.message || "Analysis complete!");
    } catch (error) {
      console.error("Error analyzing hair type:", error);
      toast.error(
        error.response?.data?.error ||
          "There was an error analyzing your hair type. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setFormData({
      hairTexture: "",
      hairThickness: "",
      hairPorosity: "",
      hairDensity: "",
      scalpOiliness: "",
      damageLevel: "",
      hairElasticity: "",
      hairLength: "",
      mainConcerns: [],
    });
    setResult(null);
  };

  const renderQuizContent = () => {
    const currentStepData = steps[currentStep];

    return (
      <div className="animate-fadeIn">
        <h2
          className="text-2xl font-medium mb-8 text-center"
          style={{ color: Color.text.default }}
        >
          {currentStepData.title}
        </h2>

        <div className="mb-8">
          <h3 className="text-xl mb-4" style={{ color: Color.primary.default }}>
            {currentStepData.question}
          </h3>

          {currentStepData.textArea ? (
            <textarea
              value={formData[currentStepData.field]}
              onChange={(e) =>
                handleChange(currentStepData.field, e.target.value)
              }
              className="w-full p-4 border rounded-lg min-h-32 resize-none"
              style={{ borderColor: `${Color.secondary.default}50` }}
              placeholder="Please share any other hair concerns or conditions (optional)"
            />
          ) : (
            <div className="space-y-3">
              {currentStepData.multiSelect
                ? // Multi-select options
                  currentStepData.options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleMultiSelectChange(option.value)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md flex items-center ${
                        formData[currentStepData.field].includes(option.value)
                          ? "border-2 shadow-sm"
                          : "border"
                      }`}
                      style={{
                        borderColor: formData[currentStepData.field].includes(
                          option.value
                        )
                          ? Color.primary.default
                          : `${Color.secondary.default}50`,
                        background: formData[currentStepData.field].includes(
                          option.value
                        )
                          ? `${Color.primary.default}10`
                          : "white",
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                          formData[currentStepData.field].includes(option.value)
                            ? "bg-opacity-100"
                            : "bg-opacity-0"
                        }`}
                        style={{
                          borderColor: formData[currentStepData.field].includes(
                            option.value
                          )
                            ? Color.primary.default
                            : `${Color.secondary.default}50`,
                          backgroundColor: formData[
                            currentStepData.field
                          ].includes(option.value)
                            ? Color.primary.default
                            : "transparent",
                        }}
                      >
                        {formData[currentStepData.field].includes(
                          option.value
                        ) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span style={{ color: Color.text.default }}>
                        {option.label}
                      </span>
                    </div>
                  ))
                : // Single-select options
                  currentStepData.options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() =>
                        handleChange(currentStepData.field, option.value)
                      }
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        formData[currentStepData.field] === option.value
                          ? "border-2 shadow-sm"
                          : "border"
                      }`}
                      style={{
                        borderColor:
                          formData[currentStepData.field] === option.value
                            ? Color.primary.default
                            : `${Color.secondary.default}50`,
                        background:
                          formData[currentStepData.field] === option.value
                            ? `${Color.primary.default}10`
                            : "white",
                      }}
                    >
                      <span style={{ color: Color.text.default }}>
                        {option.label}
                      </span>
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-10">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
              currentStep === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            style={{ color: Color.lightText.default }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          <div className="flex items-center">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? "w-4" : "w-2"
                  }`}
                  style={{
                    backgroundColor:
                      index <= currentStep
                        ? Color.primary.default
                        : `${Color.secondary.default}40`,
                  }}
                ></div>
              ))}
            </div>
            <span
              className="ml-3 text-sm"
              style={{ color: Color.lightText.default }}
            >
              {currentStep + 1}/{steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-90 active:scale-95 transform"
            style={{
              background: Color.gradient.default,
              boxShadow: `0 2px 6px ${Color.primary.default}30`,
              color: "white",
            }}
          >
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const {
      primaryType,
      secondaryType,
      concerns,
      recommendations,
      hairTypeCode,
    } = result;

    return (
      <div className="animate-fadeIn">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-medium mb-5"
            style={{ color: Color.text.default }}
          >
            Your Hair Type Analysis
          </h2>

          <div
            className="inline-block px-6 py-3 rounded-full text-white text-lg font-medium shadow-md"
            style={{
              background: Color.gradient.default,
              boxShadow: `0 4px 14px ${Color.primary.default}30`,
            }}
          >
            {hairTypeCode && `Type ${hairTypeCode}: `} {primaryType}{" "}
            {secondaryType && `+ ${secondaryType}`}
          </div>
        </div>

        <div
          className="bg-white p-6 transition-all hover:shadow-md rounded-lg border shadow-sm mb-6"
          style={{ borderColor: `${Color.secondary.default}30` }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: Color.primary.default }}
          >
            Your Hair Profile
          </h3>

          <div className="space-y-4">
            <div>
              <p
                className="font-medium mb-1"
                style={{ color: Color.text.default }}
              >
                Primary Hair Type:
              </p>
              <p style={{ color: Color.lightText.default }}>
                {hairTypeCode && `Type ${hairTypeCode}: `}
                {primaryType}
              </p>
            </div>

            {secondaryType && (
              <div>
                <p
                  className="font-medium mb-1"
                  style={{ color: Color.text.default }}
                >
                  Secondary Characteristics:
                </p>
                <p style={{ color: Color.lightText.default }}>
                  {secondaryType}
                </p>
              </div>
            )}

            <div>
              <p
                className="font-medium mb-1"
                style={{ color: Color.text.default }}
              >
                Main Concerns:
              </p>
              <p style={{ color: Color.lightText.default }}>
                {concerns
                  .map((concern) => {
                    return concern
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())
                      .replace(/^([a-z])/, (match) => match.toUpperCase());
                  })
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-lg border shadow-sm mb-8 transition-all hover:shadow-md"
          style={{ borderColor: `${Color.secondary.default}30` }}
        >
          <h3
            className="text-xl font-medium mb-4 flex items-center"
            style={{ color: Color.primary.default }}
          >
            Recommended Hair Care Routine
          </h3>

          <ul className="space-y-3">
            {recommendations.routine.map((item, index) => (
              <li
                key={index}
                className="flex items-start bg-gray-50 p-3 rounded-md transition-all hover:bg-gray-100"
                style={{ color: Color.lightText.default }}
              >
                <div
                  className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5"
                  style={{
                    background: Color.primary.default,
                    color: "white",
                  }}
                >
                  <Check className="h-3 w-3" />
                </div>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8 ">
          <div
            className="bg-white p-6 rounded-lg border transition-all hover:shadow-md shadow-sm"
            style={{ borderColor: `${Color.secondary.default}30` }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: Color.primary.default }}
            >
              Beneficial Ingredients
            </h3>

            <ul className="space-y-2">
              {recommendations.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start"
                  style={{ color: Color.lightText.default }}
                >
                  <div
                    className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5"
                    style={{
                      background: `${Color.primary.default}20`,
                      color: Color.primary.default,
                    }}
                  >
                    <span className="text-xs">✓</span>
                  </div>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-white p-6 transition-all hover:shadow-md rounded-lg border shadow-sm"
            style={{ borderColor: `${Color.secondary.default}30` }}
          >
            <h3
              className="text-lg font-medium mb-4"
              style={{ color: Color.primary.default }}
            >
              Ingredients to Avoid
            </h3>

            <ul className="space-y-2">
              {recommendations.avoidIngredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start"
                  style={{ color: Color.lightText.default }}
                >
                  <div
                    className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5"
                    style={{
                      background: `rgba(255, 99, 132, 0.2)`,
                      color: `rgba(255, 99, 132, 1)`,
                    }}
                  >
                    <span className="text-xs">✕</span>
                  </div>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="bg-white p-6 rounded-lg border shadow-sm mb-10 transition-all hover:shadow-md"
          style={{ borderColor: `${Color.secondary.default}30` }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: Color.primary.default }}
          >
            Lifestyle & Hair Care Tips
          </h3>

          <ul className="space-y-2">
            {recommendations.lifestyleConsiderations.map((lifestyle, index) => (
              <li
                key={index}
                className="flex items-start bg-gray-50 p-3 rounded-md transition-all hover:bg-gray-100"
                style={{ color: Color.lightText.default }}
              >
                <div
                  className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5"
                  style={{
                    background: Color.primary.default,
                    color: "white",
                  }}
                >
                  <Check className="h-3 w-3" />
                </div>
                <span className="pt-0.5">{lifestyle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center mb-10">
          <button
            type="button"
            onClick={resetQuiz}
            className="w-full py-3 rounded-lg transition-all duration-300 border hover:shadow-sm active:scale-95 transform"
            style={{
              borderColor: Color.primary.default,
              color: Color.primary.default,
            }}
          >
            Retake Quiz
          </button>
        </div>

        {/* Premium message */}
        <div
          className="bg-white p-6 rounded-lg border shadow-md mb-2"
          style={{
            borderColor: `${Color.primary.default}50`,
            background: `linear-gradient(145deg, ${Color.primary.default}05, ${Color.primary.default}15)`,
          }}
        >
          <div className="flex items-center mb-4">
            <div
              className="h-10 w-10 flex items-center justify-center rounded-full mr-3 shadow-md"
              style={{ background: Color.gradient.default }}
            >
              <span className="text-white text-lg font-semibold">✦</span>
            </div>
            <h3
              className="text-xl font-medium"
              style={{ color: Color.primary.default }}
            >
              Unlock Premium Analysis
            </h3>
          </div>
          <p className="mb-5" style={{ color: Color.lightText.default }}>
            Get detailed insights with our premium hair analysis, including
            personalized product recommendations, styling techniques for your
            hair type, and a comprehensive hair care calendar tailored to your
            specific needs.
          </p>
          <button
            type="button"
            className="w-full py-3 rounded-lg transition-all duration-300 hover:bg-opacity-90 active:scale-95 transform text-white font-medium"
            style={{
              background: Color.gradient.default,
              boxShadow: `0 4px 14px ${Color.primary.default}40`,
            }}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
        <div className="mb-6">
          <div className="h-16 w-16 relative">
            <div
              className="absolute top-0 left-0 h-full w-full rounded-full animate-ping opacity-30"
              style={{ background: Color.primary.default }}
            ></div>
            <div
              className="absolute top-3 left-3 h-10 w-10 rounded-full animate-pulse"
              style={{ background: Color.primary.default }}
            ></div>
          </div>
        </div>
        <h2
          className="text-2xl font-medium mb-3 text-center"
          style={{ color: Color.text.default }}
        >
          Analyzing Your Answers
        </h2>
        <p
          className="text-center max-w-sm"
          style={{ color: Color.lightText.default }}
        >
          Processing your responses to determine your hair type and provide
          personalized recommendations...
        </p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen py-12 px-4 flex items-center justify-center"
      style={{
        background: Color.bgGradient.default,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div
        className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md border animate-fadeIn"
        style={{ borderColor: `${Color.secondary.default}30` }}
      >
        <div className="flex flex-col items-center mb-10">
          <h1
            className="text-3xl font-serif font-light tracking-wide mb-3"
            style={{ color: Color.text.default }}
          >
            <span
              className="block relative"
              style={{ color: Color.primary.default }}
            >
              Hair Type Quiz
              <div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 rounded-full"
                style={{ background: Color.gradient.default }}
              ></div>
            </span>
            <span className="font-light text-sm tracking-wider">
              Discover your hair type & personalized care routine
            </span>
          </h1>
        </div>

        {isLoading
          ? renderLoading()
          : result
          ? renderResult()
          : renderQuizContent()}
      </div>
    </div>
  );
}
