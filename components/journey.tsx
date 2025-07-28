import { Badge } from "@/components/ui/badge";
import { Building2, Calendar } from "lucide-react";

interface JourneyItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

const JourneyItem = ({
  title,
  company,
  period,
  description,
  technologies,
}: JourneyItemProps) => {
  return (
    <div className="relative pl-8 not-last:pb-12">
      <div className="absolute left-0 top-2.5 h-full w-[2px] bg-muted group-first:h-[calc(100%-24px)] group-first:top-6">
        <div className="absolute h-3 w-3 -left-[5px] top-0 rounded-full border-2 border-primary bg-background" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 size-9 bg-accent rounded-full flex items-center justify-center">
            <Building2 className="size-5 text-muted-foreground" />
          </div>
          <span className="text-lg font-semibold">{company}</span>
        </div>
        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <Calendar className="size-4" />
            <span>{period}</span>
          </div>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="rounded-full">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const Journey = () => {
  const journeys = [
    {
      title: "ICT Strand – SHS",
      company: "Senior High School",
      period: "2019 – 2021",
      description:
        "Studied Information and Communications Technology, including computer hardware, software installation, and basic networking.",
      technologies: ["Hardware", "Networking", "System Setup"],
    },
    {
      title: "B.S. in Information Technology",
      company: "College",
      period: "2021 – 2025",
      description:
        "Studied modern web development, software engineering, and system design. Awarded Best Programmer and Innovator’s Research Distinction Award for outstanding academic and project excellence.",
      technologies: ["Web Development", "Software Engineering", "UI/UX", "Capstone Project"]
    },
    {
      title: "IT Staff & Junior Developer (Intern)",
      company: "OJT (On-the-Job Training)",
      period: "2025",
      description:
        "Assisted in day-to-day IT support tasks including troubleshooting, maintenance, and user support. Also contributed to internal system development using web technologies.",
      technologies: ["Troubleshooting", "IT Support", "HTML", "CSS", "JavaScript", "Database"]
    },
    {
      title: "Beyond Academics",
      company: "Self-Learning & Part-Time Work",
      period: "2019 – Present",
      description:
        "Independently learned hardware repair and software troubleshooting. Helped peers and clients with I.T. support and system upgrades.",
      technologies: ["React", "Tailwind CSS", "Hardware Repair", "I.T. Help"],
    },
  ];

  return (
    <section id="journey" className="relative py-20 px-6">
      <div className="max-w-screen-md mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Journey
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            From Curiosity to Capability
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
            A timeline of my learning, growth, and hands-on tech exploration.
          </p>
        </div>

        <div className="relative">
          {journeys.map((journey, index) => (
            <JourneyItem key={index} {...journey} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
