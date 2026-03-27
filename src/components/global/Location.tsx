import Icon from "./Icon"

const Location = () => (
  <>
    <div className="flex h-6 w-6 items-center justify-center">
      <Icon.mapPin className="text-red-400" />
    </div>
    <span className="text-sm leading-none text-gray-600 dark:text-gray-400">
      Brooklyn, New York
    </span>
  </>
)

export { Location }
