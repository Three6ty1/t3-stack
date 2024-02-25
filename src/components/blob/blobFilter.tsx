import { BlobTags } from "@prisma/client";
import { capitalise } from "~/helper/blobHelper";

type Props = {
  filter: {tags: Set<BlobTags>},
  handleFilter: (filter: Set<BlobTags>) => void,
}

export default function BlobFilter({ filter, handleFilter } : Props) {
  const handleCheck = (tag: string, checked: boolean) => {
    if (checked) {
      handleFilter(filter.tags.add(BlobTags[tag as keyof typeof BlobTags]));
    } else {
      filter.tags.delete(BlobTags[tag as keyof typeof BlobTags]);
      handleFilter(filter.tags);
    }
  };

  return (
    <details className="dropdown dropdown-end">
      <summary className="m-1 btn">Filters</summary>
      <ul className="menu dropdown-content z-[1] rounded-box bg-base-100 p-2 shadow w-64">
        <div className="flex flex-row flex-wrap">
          {Object.values(BlobTags).map((tag) => (
            <label key={`${tag} select option`} className="label cursor-pointer w-1/2 justify-end">
              <li>
                <div className="flex flex-row form-control">
                  <span className="label-text">{capitalise(tag)}</span>
                  <input
                    id={tag}
                    type="checkbox"
                    className="checkbox"
                    checked={filter?.tags.has(tag)}
                    onChange={(e) =>
                      handleCheck(
                        e.target.id.toUpperCase(),
                        e.target.checked,
                      )
                    }
                  />
                </div>
              </li>
            </label>
          ))}
        </div>
      </ul>
    </details>
  )
}