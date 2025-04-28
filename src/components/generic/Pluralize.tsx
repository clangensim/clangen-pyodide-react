function Pluralize({num, children}: {num: number | undefined, children: string}) {
  if (num !== 1) {
    return <>{children}s</>
  } else {
    return <>{children}</>
  }
}

export default Pluralize;
