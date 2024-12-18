import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CourseFieldsProps {
  instructor: string;
  setInstructor: (value: string) => void;
  courseSyllabus: string;
  setCourseSyllabus: (value: string) => void;
}

export const CourseFields = ({
  instructor,
  setInstructor,
  courseSyllabus,
  setCourseSyllabus,
}: CourseFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="courseSyllabus">Programa del Curso</Label>
        <Textarea
          id="courseSyllabus"
          value={courseSyllabus}
          onChange={(e) => setCourseSyllabus(e.target.value)}
          rows={5}
        />
      </div>
    </>
  );
};