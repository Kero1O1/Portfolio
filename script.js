
(() => {
  "use strict";

  const byId = (id) => document.getElementById(id);

  function init() {
    // Current year
    const year = byId("year");

    if (year) {
      year.textContent = String(new Date().getFullYear());
    }

    // Typewriter role animation
    const typedRole = byId("typed-role");

    if (typedRole) {
      const roles = [
        "student",
        "software developer",
        "cloud engineer"
      ];

      let roleIndex = 0;
      let characterIndex = roles[0].length;
      let deleting = true;

      function animateRole() {
        const currentRole = roles[roleIndex];

        typedRole.textContent = currentRole.slice(0, characterIndex);

        if (!deleting && characterIndex < currentRole.length) {
          characterIndex += 1;
          window.setTimeout(animateRole, 85);
        } else if (!deleting) {
          deleting = true;
          window.setTimeout(animateRole, 1350);
        } else if (characterIndex > 0) {
          characterIndex -= 1;
          window.setTimeout(animateRole, 42);
        } else {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(animateRole, 280);
        }
      }

      window.setTimeout(animateRole, 1100);
    }

    // Mobile navigation
    const menuButton = byId("menu-toggle");
    const nav = document.querySelector(".main-nav");

    if (menuButton && nav) {
      menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");

        menuButton.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("open");

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        });
      });
    }

    // Attach a full-card documentation link to projects marked clickable
    document.querySelectorAll('.project-row[data-clickable="true"][data-project-url]').forEach((card) => {
      if (card.querySelector(".project-card-hitarea")) return;

      const cardLink = document.createElement("a");
      cardLink.className = "project-card-hitarea";
      cardLink.href = card.dataset.projectUrl;
      cardLink.target = "_blank";
      cardLink.rel = "noopener noreferrer";
      cardLink.setAttribute(
        "aria-label",
        card.dataset.projectLabel || "Open project documentation in a new tab"
      );
      card.appendChild(cardLink);
    });

    // Reusable project image preview
    const lightbox = byId("project-lightbox");
    const lightboxImage = lightbox?.querySelector(".project-lightbox-image");
    const lightboxClose = lightbox?.querySelector(".project-lightbox-close");
    let previewOpener = null;

    if (lightbox && lightboxImage) {
      document.querySelectorAll(".project-preview[data-preview-src]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          previewOpener = button;
          lightboxImage.src = button.dataset.previewSrc;
          lightboxImage.alt = button.dataset.previewAlt || "Project image preview";
          lightbox.showModal();
        });
      });

      lightboxClose?.addEventListener("click", () => lightbox.close());

      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
      });

      lightbox.addEventListener("close", () => {
        lightboxImage.removeAttribute("src");
        previewOpener?.focus();
      });
    }

    // Terminal elements
    const output = byId("terminal-output");
    const form = byId("terminal-form");
    const input = byId("terminal-input");
    const clearButton = byId("terminal-clear");

    if (!output || !form || !input) return;

    // Terminal commands and responses
    const responses = {
      help: [
        "Available commands:",
        "  about      — a short introduction",
        "  skills     — technologies and areas of focus",
        "  projects   — selected work",
        "  experience — professional experience",
        "  education  — academic background",
        "  contact    — how to reach me",
        "  clear      — clear the terminal"
      ],

      about: [
        "Kerolos Isaac — Cloud Engineer and Software Developer.",
        "Interested in AWS, networking, software development and cloud architecture.",
        "Currently studying Computer Science at the University of Bari."
      ],

      skills: [
        "CLOUD: AWS, S3, EC2, VPC, Lambda, CloudFront, Terraform (learning)",
        "DEVELOPMENT: Java, Spring Boot, Python, TypeScript, React, Next.js, Angular",
        "SYSTEMS: Networking fundamentals, CCNA, Windows Server, Linux, Docker (learning)",
        "TOOLS: Git, GitLab, PostgreSQL, Burp Suite"
      ],

      projects: [
        "01  Shortly – URL Shortener — creates unique short codes and redirects users to their original URLs; built with Flask, PostgreSQL and Redis.",
        "02  Three-Tier Web Application — retrieves and inserts user data through APIs; API Gateway and Lambda handle logic; DynamoDB stores the data.",
        "    Presentation tier: S3, CloudFront, IAM, and OAC.",
        "03  Cloud Resume Challenge — static hosting on S3, global CloudFront delivery, secure access, and a future serverless visitor counter.",
        "04  Eventify – Event Management — event management platform; frontend contribution at Lutech."
      ],

      experience: [
        "Lutech SPA — Software Developer Intern (Mar 2025 – Jul 2026).",
        "Outlier.ai — AI Response Evaluator (Nov 2024 – Jul 2026)."
      ],

      education: [
        "BSc Computer Science — University of Bari (Sep 2026 – present).",
        "Software Development Diploma — ITS Apulia Digital Maker (110/110).",
        "High School Diploma, Computer Science — Don Bosco Technical Institute."
      ],

      contact: [
        "Email: kerolosibrahimbusi@gmail.com",
        "LinkedIn: linkedin.com/in/kerolosisaac",
        "GitHub: github.com/Kero1O1"
      ]
    };

    // Print a line in the terminal
    function appendLine(text, className = "") {
      const line = document.createElement("p");

      if (className) {
        line.className = className;
      }

      line.textContent = text;
      output.appendChild(line);
    }

    // Execute a terminal command
    function runCommand(rawCommand) {
      const command = rawCommand.trim().toLowerCase();

      if (!command) return;

      appendLine(
        `visitor@kerolos ~ $ ${rawCommand}`,
        "terminal-blue"
      );

      // Clear command
      if (command === "clear") {
        output.replaceChildren();

        appendLine(
          "Terminal cleared. Type help to see available commands.",
          "terminal-muted"
        );

        return;
      }

      // Find command response
      const result = responses[command];

      if (!result) {
        appendLine(
          `Command not found: ${command}. Type "help" to see available commands.`,
          "terminal-muted"
        );
      } else {
        result.forEach((line) => {
          appendLine(line, "terminal-green");
        });
      }

      output.scrollTop = output.scrollHeight;
    }

    // Submit command using Enter
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      runCommand(input.value);

      input.value = "";
      input.focus();
    });

    // Clear button
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        output.replaceChildren();

        appendLine(
          "Terminal cleared. Type help to see available commands.",
          "terminal-muted"
        );

        input.focus();
      });
    }

    // Quick command shortcuts
    document.querySelectorAll("[data-command]").forEach((button) => {
      button.addEventListener("click", () => {
        const command =
          button.getAttribute("data-command") || "";

        runCommand(command);
        input.focus();
      });
    });
  }

  // Initialize after HTML has loaded
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
