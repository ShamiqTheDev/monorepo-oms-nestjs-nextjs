"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { css, styled } from "@atdb/design-system";
import * as React from "react";

interface BreadcrumbProps {
  separator: React.ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
}

function kebabToTitleCase(text: string): string {
  const words = text.split("-");
  const titleCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return titleCase;
}

const Breadcrumb = ({ separator, containerClasses, listClasses, activeClasses, capitalizeLinks }: BreadcrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <div>
      <styled.ul className={containerClasses} display="flex" fontSize="xs" gap="md">
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses;
          const itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link;
          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>{kebabToTitleCase(itemLink)}</Link>
              </li>
              {pathNames.length !== index + 1 &&
                React.cloneElement(separator as React.ReactElement, {
                  className: css({ fontWeight: 600 }),
                })}
            </React.Fragment>
          );
        })}
      </styled.ul>
    </div>
  );
};

export { Breadcrumb };
