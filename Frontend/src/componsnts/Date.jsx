export default function Date() {
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <label htmlFor="month">
                <input type="month" name="month" id="month" className="" />
            </label>
            <div className="flex gap-6 items-center justify-between">
                <div className="flex flex-col items-center justify-around">
                    <p className="day">Monday</p>
                    <p className="date">01</p>
                </div>
            </div>
        </div>
    )
}