import Icon from "./Icon"

const Location = () => (
  <>
    <div className="flex justify-center">
      <Icon.mapPin className="text-red-400" />
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-400">
      Brooklyn, New York
    </span>
  </>
)

export default Location
