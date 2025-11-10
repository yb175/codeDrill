function AccordionItem({ title, children, defaultOpen = false }) {
  return (
    <div className="collapse collapse-arrow bg-base-200 rounded-lg">
      <input type="checkbox" defaultChecked={defaultOpen} /> 
      <div className="collapse-title text-xl font-medium">
        {title}
      </div>
      <div className="collapse-content">
        <div className="flex flex-col gap-4 p-1 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AccordionItem