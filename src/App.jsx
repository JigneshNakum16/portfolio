import "./App.css";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Code,
  Database,
  Globe,
  Smartphone,
  Phone,
  GraduationCap,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import photo from "./assets/photo.png";
import sudharshan from "./assets/sudharshan.png";
import sliderBg from "./assets/slider-bg.png";

function App() {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    from_name: "",
    reply_to: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const texts = ["Software Engineer", "Web Developer"];

  // Animated text effect
  useEffect(() => {
    const currentText = texts[currentTextIndex];
    const speed = isDeleting ? 50 : 100;

    if (!isDeleting && displayText === currentText) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      } else {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentTextIndex, texts]);

  // Scroll event listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu first
      setIsMobileMenuOpen(false);

      // Add a small delay for mobile menu to close
      setTimeout(() => {
        const headerHeight = 80; // Approximate header height
        const elementPosition = element.offsetTop - headerHeight;

        // Check if it's mobile device
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          // For mobile, use a more direct approach
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth",
          });
        } else {
          // For desktop, use scrollIntoView
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Additional scroll adjustment
          setTimeout(() => {
            window.scrollTo({
              top: elementPosition,
              behavior: "smooth",
            });
          }, 100);
        }
      }, 300);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.from_name.trim()) {
      newErrors.from_name = "Name is required";
    } else if (formData.from_name.trim().length < 2) {
      newErrors.from_name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.reply_to.trim()) {
      newErrors.reply_to = "Email is required";
    } else if (!validateEmail(formData.reply_to)) {
      newErrors.reply_to = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Phone number can only contain digits";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow digits
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    // Check if EmailJS is configured
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (
      serviceId &&
      templateId &&
      publicKey &&
      serviceId !== "your_service_id_here"
    ) {
      // Use EmailJS if configured
      import("@emailjs/browser").then((emailjs) => {
        emailjs.default
          .sendForm(serviceId, templateId, e.target, publicKey)
          .then(() => {
            setSubmitMessage(
              "Thank you! Your message has been sent successfully."
            );
            setFormData({ from_name: "", reply_to: "", phone: "", message: "" });
            setErrors({});
          })
          .catch(() => {
            setSubmitMessage(
              "Sorry, there was an error sending your message. Please try again."
            );
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      });
    } else {
      // Fallback to mailto if EmailJS not configured
      const subject = `Portfolio Contact from ${formData.from_name}`;
      const body = `
Name: ${formData.from_name}
Email: ${formData.reply_to}
Phone: ${formData.phone}

Message:
${formData.message}
      `;

      const mailtoLink = `mailto:jigneshnakum16@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // Open default email client
      window.location.href = mailtoLink;

      // Show success message
      setSubmitMessage("Email client opened! Please send the email manually.");
      setFormData({ from_name: "", reply_to: "", phone: "", message: "" });
      setErrors({});
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Refs for scroll detection
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const educationRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, threshold: 0.3 });
  const skillsInView = useInView(skillsRef, { once: true, threshold: 0.3 });
  const projectsInView = useInView(projectsRef, { once: true, threshold: 0.3 });
  const contactInView = useInView(contactRef, { once: true, threshold: 0.3 });
  const educationInView = useInView(educationRef, {
    once: true,
    threshold: 0.3,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-2xl font-black text-primary tracking-wider relative">
                <span className="relative z-10">&lt;JN/&gt;</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300"></div>
            </motion.div>

            {/* Navigation */}
            <motion.nav
              className="hidden md:flex items-center space-x-1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "education", label: "Education" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Works" },
                { id: "contact", label: "Contact" },
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 text-foreground/80 hover:text-primary transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                </motion.button>
              ))}
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 hover:bg-card/80 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                <div
                  className={`w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-5 h-0.5 bg-foreground rounded-full transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/20 shadow-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-2">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "education", label: "Education" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Works" },
                { id: "contact", label: "Contact" },
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                  }}
                  className="text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : -20,
                  }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="relative">
                    {item.label}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
        style={{
          backgroundImage: `url(${sliderBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Content Section (Left) */}
            <div className="text-center md:text-left space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-lg text-primary mb-2 font-medium tracking-wide">
                  HELLO I'M
                </p>
                <div className="w-16 h-1 bg-primary rounded-full mx-auto md:mx-0 mb-4"></div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Jignesh
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Nakum
                </span>
              </motion.h1>

              <motion.h2
                className="text-2xl md:text-3xl text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                A Passionate{" "}
                <span className="text-primary font-semibold relative">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </motion.h2>

              <motion.p
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Crafting digital experiences with code and creativity. Let's
                build something amazing together.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => scrollToSection("contact")}
                >
                  SAY HELLO
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary hover:text-background transition-all duration-300"
                  onClick={() => scrollToSection("projects")}
                >
                  VIEW WORK
                </Button>
              </motion.div>
            </div>

            {/* Profile Image (Right) */}
            <motion.div
              className="w-full max-w-md mx-auto md:mx-0 md:ml-auto flex-shrink-0 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Profile Image Container */}
              <div className="relative w-80 h-80 mx-auto">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse"></div>

                {/* Profile Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                  <img
                    src={photo}
                    alt="Jignesh Nakum"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary/60 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -left-4 w-3 h-3 bg-primary/40 rounded-full animate-bounce"></div>

                {/* Floating Tech Icons */}
                <motion.div
                  className="absolute -top-8 -left-8 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/20 shadow-lg"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Code size={20} className="text-primary" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-8 -right-8 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/20 shadow-lg"
                  animate={{ y: [5, -5, 5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <Database size={20} className="text-primary" />
                </motion.div>
              </div>

              {/* Social Links */}
              <motion.div
                className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, staggerChildren: 0.1 }}
              >
                <motion.a
                  href="https://github.com/JigneshNakum16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 shadow-lg border border-border/50"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={20} />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/jignesh-nakum-211683231"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 shadow-lg border border-border/50"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={20} />
                </motion.a>
                <motion.a
                  href="https://x.com/Jignesh08155221"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 shadow-lg border border-border/50"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter size={20} />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-card/20" ref={aboutRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-4xl font-bold mb-8 text-foreground"
              variants={fadeInUp}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              I'm a passionate{" "}
              <strong className="text-primary">Software Engineer</strong> with
              over{" "}
              <strong className="text-primary">1.5 years of experience</strong>{" "}
              in building modern, high-performance web applications. I
              specialize in the{" "}
              <strong className="text-primary">MERN stack</strong> with a strong
              focus on <strong className="text-primary">React.js</strong>{" "}
              development and frontend architecture.
            </motion.p>
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              During my time at{" "}
              <strong className="text-primary">Ciphernutz IT Services</strong>,
              I worked on scalable web solutions that delivered seamless user
              experiences across devices. I've collaborated with
              cross-functional teams, used{" "}
              <strong className="text-primary">Redux</strong> for state
              management, and followed{" "}
              <strong className="text-primary">Agile</strong> development
              practices to ensure efficient and timely delivery.
            </motion.p>
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              What drives me is turning complex problems into clean, functional,
              and intuitive user interfaces. Whether it's building full-stack
              applications or optimizing front-end performance, I'm always eager
              to learn and push boundaries with every project I take on.
            </motion.p>
            <motion.p
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
              variants={fadeInUp}
            >
              I'm currently open to{" "}
              <strong className="text-primary">freelance opportunities</strong>{" "}
              where I can contribute to innovative products, solve real-world
              problems, and grow alongside passionate teams.
            </motion.p>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              <motion.div className="text-center" variants={scaleIn}>
                <div className="text-3xl font-bold text-primary mb-2">1.5+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </motion.div>
              <motion.div className="text-center" variants={scaleIn}>
                <div className="text-3xl font-bold text-primary mb-2">5+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </motion.div>
              <motion.div className="text-center" variants={scaleIn}>
                <div className="text-3xl font-bold text-primary mb-2">5+</div>
                <div className="text-muted-foreground">
                  Technologies Mastered
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20" ref={educationRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate={educationInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-4xl font-bold mb-8 text-foreground"
              variants={fadeInUp}
            >
              Education
            </motion.h2>
            <div className="space-y-8 text-left">
              <motion.div
                className="bg-card p-6 rounded-lg shadow-md"
                variants={fadeInUp}
              >
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Master of Computer Applications (MCA)
                </h3>
                <p className="text-lg text-foreground mb-1">
                  Dharmsinh Desai University (DDU)
                </p>
                <p className="text-muted-foreground">2023 – 2025</p>
              </motion.div>
              <motion.div
                className="bg-card p-6 rounded-lg shadow-md"
                variants={fadeInUp}
              >
                <h3 className="text-2xl font-semibold text-primary mb-2">
                  Bachelor of Computer Applications (BCA)
                </h3>
                <p className="text-lg text-foreground mb-1">
                  Veer Narmad South Gujarat University (VNSGU)
                </p>
                <p className="text-muted-foreground">2020 – 2023</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-card/20" ref={skillsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={skillsInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-4xl font-bold mb-12 text-center text-foreground"
              variants={fadeInUp}
            >
              Technical Skills
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              <motion.div
                className="text-center p-6 bg-card rounded-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Code className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Frontend</h3>
                <p className="text-muted-foreground">
                  React.js, Next.js, HTML5, CSS3, JavaScript, TypeScript,
                  Bootstrap, Tailwind CSS
                </p>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-card rounded-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Database className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Backend & Database
                </h3>
                <p className="text-muted-foreground">
                  Node.js, Express.js, MongoDB, MySQL, REST APIs, Swagger
                </p>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-card rounded-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">CMS & Platforms</h3>
                <p className="text-muted-foreground">
                  WordPress, Content Management Systems
                </p>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-card rounded-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Github className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Version Control</h3>
                <p className="text-muted-foreground">
                  Git, GitHub, GitLab, Git Workflow
                </p>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-card rounded-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Development Tools
                </h3>
                <p className="text-muted-foreground">
                  VS Code, Postman, Docker, API Testing
                </p>
              </motion.div>
              <motion.div
                className="text-center p-6 bg-card rounded-lg"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Other Skills</h3>
                <p className="text-muted-foreground">
                  Responsive Design, UI/UX, Agile, Problem Solving
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20" ref={projectsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-4xl font-bold mb-12 text-center text-foreground"
              variants={fadeInUp}
            >
              Projects
            </motion.h2>
            <motion.div
              className="flex justify-center"
              variants={staggerContainer}
            >
              <motion.div
                className="bg-card rounded-lg p-6 max-w-2xl w-full"
                variants={scaleIn}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-full h-64 bg-muted rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={sudharshan}
                    alt="Sudarshan Services Project"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-foreground">
                      Sudarshan Services
                    </h3>
                    <p className="text-lg font-semibold text-primary mb-2">
                      Frozen Foods and Products
                    </p>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Successfully Delivered
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    A complete web presence for Sudarshan Services, a company
                    involved in supply chain management, agro exports, frozen
                    food distribution, and industrial chemical trading.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      Key Features:
                    </h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                      <li>
                        Showcased company profile and multi-industry services
                        using <strong className="text-primary">React.js</strong>
                      </li>
                      <li>
                        Built dynamic pages for key verticals: Agro products,
                        Frozen foods, Chemical trading, and International
                        logistics
                      </li>
                      <li>
                        Integrated modern UI to enhance user engagement and
                        highlight core business values
                      </li>
                      <li>
                        Successfully delivered and deployed the solution for the
                        client's internal and external stakeholders
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">
                          Live Website:
                        </span>
                        <a
                          href="https://sudarshanservices.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1"
                        >
                          Client Website
                        </a>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          Status:
                        </span>
                        <span className="text-green-600 ml-1">
                          Successfully delivered
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          Client:
                        </span>
                        <span className="text-muted-foreground ml-1">
                          Sudarshan Services (in collaboration with Samudra
                          Foods)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-card/20" ref={contactRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-4xl font-bold mb-8 text-foreground"
              variants={fadeInUp}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground mb-12"
              variants={fadeInUp}
            >
              I'm always open to discussing new opportunities and interesting
              projects. Let's connect and see how we can work together!
            </motion.p>
            <motion.form
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12"
              variants={staggerContainer}
              onSubmit={handleSubmit}
            >
              <motion.div className="space-y-2" variants={fadeInUp}>
                <input
                  type="text"
                  name="from_name"
                  placeholder="Your Name *"
                  value={formData.from_name}
                  onChange={handleInputChange}
                  className={`p-3 rounded-lg bg-card border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 w-full ${
                    errors.from_name ? 'border-red-500' : 'border-border'
                  }`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.from_name && (
                  <p className="text-red-500 text-sm">{errors.from_name}</p>
                )}
              </motion.div>
              
              <motion.div className="space-y-2" variants={fadeInUp}>
                <input
                  type="text"
                  name="reply_to"
                  placeholder="Your Email *"
                  value={formData.reply_to}
                  onChange={handleInputChange}
                  className={`p-3 rounded-lg bg-card border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 w-full ${
                    errors.reply_to ? 'border-red-500' : 'border-border'
                  }`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.reply_to && (
                  <p className="text-red-500 text-sm">{errors.reply_to}</p>
                )}
              </motion.div>
              
              <motion.div className="space-y-2 md:col-span-2" variants={fadeInUp}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`p-3 rounded-lg bg-card border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 w-full ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </motion.div>
              
              <motion.div className="space-y-2 md:col-span-2" variants={fadeInUp}>
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`p-3 rounded-lg bg-card border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 w-full ${
                    errors.message ? 'border-red-500' : 'border-border'
                  }`}
                  whileFocus={{ scale: 1.02 }}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
              </motion.div>
              <motion.div variants={fadeInUp} className="md:col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 w-full disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                  <Mail className="mr-2 h-5 w-full" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </motion.div>
              {submitMessage && (
                <motion.div
                  className="md:col-span-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p
                    className={`text-sm ${
                      submitMessage.includes("Thank you")
                        ? "text-primary"
                        : "text-red-500"
                    }`}
                  >
                    {submitMessage}
                  </p>
                </motion.div>
              )}
            </motion.form>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
            >
              <motion.div 
                className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 hover:bg-card/80 transition-all duration-300 cursor-pointer group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm break-words">
                  jigneshnakum16@gmail.com
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 hover:bg-card/80 transition-all duration-300 cursor-pointer group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground text-sm">
                  +91 9712157194
                </p>
              </motion.div>
              
              <motion.a 
                href="https://www.linkedin.com/in/jignesh-nakum-211683231"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 cursor-pointer group block"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">LinkedIn</h3>
                <p className="text-muted-foreground text-sm break-words group-hover:text-primary/80 transition-colors duration-300">
                  linkedin.com/in/jignesh-nakum-211683231
                </p>
              </motion.a>
              
              <motion.a 
                href="https://github.com/JigneshNakum16"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/20 hover:bg-card/80 hover:border-primary/30 transition-all duration-300 cursor-pointer group block"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-8 h-8 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">GitHub</h3>
                <p className="text-muted-foreground text-sm break-words group-hover:text-primary/80 transition-colors duration-300">
                  github.com/JigneshNakum16
                </p>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card">
        <div className="container mx-auto px-4 text-center">
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            © {currentYear} Jignesh Nakum. All rights reserved.
          </motion.p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 scale-100"
            : "opacity-0 scale-0 pointer-events-none"
        }`}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </div>
  );
}

export default App;
