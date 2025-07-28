import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Laptop2, UsersRound } from "lucide-react";
import Image from "next/image";
import { HTMLAttributes } from "react";

const About = () => {
  return (
    <section id="about" className="relative py-20 px-6">
      <div className="max-w-screen-md mx-auto">
        <div className="flex flex-col md:flex-row-reverse gap-12">
          <ProfileImage className="hidden md:block" />

          {/* Content */}
          <div className="flex-1 md:text-left">
            <Badge variant="secondary" className="mb-4">
              About Me
            </Badge>
            <ProfileImage className="mt-3 mb-8 block md:hidden" />
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Passionate about creating real-world tech solutions
            </h2>
            <p className="text-muted-foreground mb-6 text-justify">
              I&apos;m Errol Solomon — a multi-skilled tech enthusiast with hands-on experience in full-stack development, I.T. support, hardware repair, and creative research. From building modern web apps with React and Tailwind CSS to fixing systems and exploring new ideas, I enjoy improving systems and turning tech challenges into creative solutions.

            </p>
            <div className="flex flex-wrap gap-4 justify-start">
              <Button className="rounded-full">
                <Laptop2 />
                View My Work
              </Button>
              <Button variant="outline" className="rounded-full">
                <UsersRound />
                Let&apos;s Collaborate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProfileImage = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-10 w-48 h-48 md:w-64 md:h-64", className)} {...props}>
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-accent">
      <Image src="/about-me.jpg" alt="" className="object-cover" fill />
    </div>
  </div>
);
export default About;
