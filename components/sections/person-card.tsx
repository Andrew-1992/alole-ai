import Image from "next/image";
import type { Person } from "@/lib/schemas/content";

/** A person from content/company.ts. Empty optional fields (bio, photo) are not shown. */
export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="flex items-start gap-5">
      {person.photo && (
        <Image
          src={person.photo.src}
          alt={person.photo.alt}
          width={person.photo.width}
          height={person.photo.height}
          sizes="96px"
          className="size-24 shrink-0 rounded-md object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        <p className="text-h3 font-medium">{person.name}</p>
        <p className="text-muted">{person.title}</p>
        {person.bio && <p className="max-w-prose pt-3">{person.bio}</p>}
      </div>
    </div>
  );
}
