"use client";

import { useState } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Color } from "../../../utils/Colors";
import { Constant, ApiEndpoints } from "../../../utils/ApiConst";

export default function SkinTypeQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    skinAfterWashing: "",
    shineLevels: "",
    breakoutFrequency: "",
    skinSensitivity: "",
    climateEffect: "",
    makeupStaying: "",
    hydrationStatus: "",
    mainConcerns: [],
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: "Basic Information",
      question: "What is your age range?",
      field: "age",
      options: [
        { value: "under18", label: "Under 18" },
        { value: "18-24", label: "18-24" },
        { value: "25-34", label: "25-34" },
        { value: "35-44", label: "35-44" },
        { value: "45-54", label: "45-54" },
        { value: "55+", label: "55+" },
      ],
    },
    {
      title: "Cleansing Response",
      question: "How does your skin feel after washing?",
      field: "skinFeelAfterWashing",
      options: [
        { value: "tight", label: "Tight and dry" },
        { value: "comfortable", label: "Comfortable and balanced" },
        { value: "stillOily", label: "Still feels oily" },
        { value: "irritated", label: "Irritated or sensitive" },
      ],
    },
    {
      title: "Shine Levels",
      question:
        "How would you describe your skin's shine levels throughout the day?",
      field: "shineLevels",
      options: [
        { value: "alwaysMatte", label: "Always matte, sometimes flaky" },
        { value: "mostlyMatte", label: "Mostly matte with occasional shine" },
        { value: "shinyTzone", label: "Shiny in the T-zone by midday" },
        { value: "shinyAll", label: "Shiny all over by midday" },
      ],
    },
    {
      title: "Breakout Frequency",
      question: "How often do you experience breakouts?",
      field: "breakoutFrequency",
      options: [
        { value: "rarely", label: "Rarely or never" },
        {
          value: "occasionally",
          label: "Occasionally",
        },
        { value: "frequently", label: "Frequently, mostly in T-zone" },
        { value: "constant", label: "Constant or severe breakouts" },
      ],
    },
    {
      title: "Skin Sensitivity",
      question: "How sensitive is your skin?",
      field: "skinSensitivity",
      options: [
        { value: "notSensitive", label: "Not sensitive at all" },
        {
          value: "slightlySensitive",
          label: "Slightly sensitive to some products",
        },
        { value: "moderatelySensitive", label: "Moderately sensitive" },
        { value: "verySensitive", label: "Very sensitive, easily irritated" },
      ],
    },
    {
      title: "Climate Effects",
      question: "How does your skin respond to climate changes?",
      field: "climateEffect",
      options: [
        { value: "drier", label: "Gets drier and flakier" },
        { value: "noChange", label: "No significant changes" },
        { value: "oilier", label: "Gets oilier" },
        { value: "irritated", label: "Gets irritated and reactive" },
      ],
    },
    {
      title: "Makeup Staying Power",
      question: "How does makeup wear on your skin?",
      field: "makeupStaying",
      options: [
        { value: "flakes", label: "Tends to flake or look patchy" },
        { value: "staysWell", label: "Stays well throughout the day" },
        { value: "fadesTzone", label: "Fades or separates in T-zone" },
        { value: "slidesOff", label: "Slides off within a few hours" },
        { value: "doNotUseMakeup", label: "Don't use makeup" },
      ],
    },
    {
      title: "Hydration Status",
      question: "How would you describe your skin's hydration level?",
      field: "hydrationStatus",
      options: [
        { value: "alwaysDry", label: "Always feels dry and tight" },
        { value: "wellHydrated", label: "Well-hydrated and comfortable" },
        { value: "dehydratedOily", label: "Dehydrated but still gets oily" },
        {
          value: "variesGreatly",
          label: "Varies greatly with weather/seasons",
        },
      ],
    },
    {
      title: "Main Concerns",
      question: "What are your main skin concerns? (Select up to 3)",
      field: "mainConcerns",
      multiSelect: true,
      options: [
        { value: "dryness", label: "Dryness or flakiness" },
        { value: "oiliness", label: "Excessive oiliness" },
        { value: "acne", label: "Acne or breakouts" },
        { value: "sensitivity", label: "Sensitivity or redness" },
        { value: "aging", label: "Signs of aging" },
        { value: "dullness", label: "Dullness or uneven texture" },
        {
          value: "hyperpigmentation",
          label: "Hyperpigmentation or dark spots",
        },
        { value: "largePoRes", label: "Large pores" },
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
      age: getLabel("age"),
      skin_feel_after_washing: getLabel("skinFeelAfterWashing"),
      shine_levels: getLabel("shineLevels"),
      breakout_frequency: getLabel("breakoutFrequency"),
      skin_sensitivity: getLabel("skinSensitivity"),
      climate_effect: getLabel("climateEffect"),
      makeup_staying: getLabel("makeupStaying"),
      hydration_status: getLabel("hydrationStatus"),
      main_concerns: formatConcerns(),
    };
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formattedData = formatData();

      const response = await axios.post(
        `${Constant.baseURL}${ApiEndpoints.SKIN_TYPE}`,
        formattedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const transformedResult = {
        primaryType: response.data.primary_skin_type,
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
      };

      setResult(transformedResult);
      toast.success(response.data.message || "Analysis complete!");
    } catch (error) {
      console.error("Error analyzing skin type:", error);
      toast.error(
        error.response?.data?.error ||
          "There was an error analyzing your skin type. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setFormData({
      age: "",
      skinFeelAfterWashing: "",
      shineLevels: "",
      breakoutFrequency: "",
      skinSensitivity: "",
      climateEffect: "",
      makeupStaying: "",
      hydrationStatus: "",
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
              placeholder="Please share any other skin concerns, specific product reactions, or conditions (optional)"
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
    const { primaryType, secondaryType, concerns, recommendations } = result;

    return (
      <div className="animate-fadeIn">
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-medium mb-5"
            style={{ color: Color.text.default }}
          >
            Your Skin Type Analysis
          </h2>

          <div
            className="inline-block px-6 py-3 rounded-full text-white text-lg font-medium shadow-md"
            style={{
              background: Color.gradient.default,
              boxShadow: `0 4px 14px ${Color.primary.default}30`,
            }}
          >
            {primaryType} {secondaryType && `+ ${secondaryType}`} Skin
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
            Your Skin Profile
          </h3>

          <div className="space-y-4">
            <div>
              <p
                className="font-medium mb-1"
                style={{ color: Color.text.default }}
              >
                Primary Skin Type:
              </p>
              <p style={{ color: Color.lightText.default }}>{primaryType}</p>
            </div>

            {secondaryType && (
              <div>
                <p
                  className="font-medium mb-1"
                  style={{ color: Color.text.default }}
                >
                  Secondary Characteristic:
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
                      .replace(/([A-Z])/g, " $1") // Insert space before capital letters
                      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                      .replace(/^([a-z])/, (match) => match.toUpperCase()); // Another way to capitalize first letter
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
            Recommended Routine
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
            Lifestyle Considerations
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
            Get detailed insights with our premium skin analysis, including
            personalized product recommendations, ingredient breakdown, and a
            30-day skincare routine calendar tailored to your specific needs.
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
          Processing your responses to determine your skin type and provide
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
              Skin Type Quiz
              <div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-16 rounded-full"
                style={{ background: Color.gradient.default }}
              ></div>
            </span>
            <span className="font-light text-sm tracking-wider">
              Discover your skin type & personalized care routine
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
