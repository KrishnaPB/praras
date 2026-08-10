import re

with open("product-biscamaze-lf.html", "r", encoding="utf-8") as f:
    content = f.read()

new_info = """                <div>
                    <p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">Biscamaze&reg; LF is used for bakers wares containing the E numbers E-1101, E-407a, E-415 and E-1405.</p>
                    <p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">This improves the customer perception of the baked products</p>
                    
                    <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Benefits</h3>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Biscamaze&reg; LF improves texture and overall quality such as browning and crispiness in biscuits and crackers</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Increases biscuit stack height upto 5% with cost effectiveness.</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Helps in fat reduction upto 20% even more depending on the fat percentage</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">SMBS can be reduced by 40-60%</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Cost effective</span></div>

                    <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Sensory Benefits</h3>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">It offers crispy bite</span></div>

                    <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Application Conditions</h3>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Recommended dose of 20-100g per 100kg flour.</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Add Biscamaze&reg; LF directly to the flour.</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">Temp. Range 20⁰C to 70⁰C.</span></div>
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-left: 1rem;"><span style="color: var(--c-primary); font-weight: bold;">&bull;</span><span style="color: var(--c-muted); line-height: 1.6;">pH range 3.5 to 8.5</span></div>

                    <h3 style="color: var(--c-primary); font-size: 1.25rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--c-border); padding-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Storage Conditions & Packaging</h3>
                    <p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">Biscamaze&reg; LF must be stored at temp. 25&plusmn;5&deg;C and 35&plusmn;5% humid conditions</p>
                    <p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">It is best if used before 12 months from date of manufacturing.</p>
                    <p style="margin-bottom: 1rem; color: var(--c-muted); line-height: 1.6;">It is available in 25kg HDPE Bags.</p>
                </div>"""

# Find the block starting with "<div>" after Important Information heading and ending before "</div>\n            </div>\n            \n        </div>"
pattern = r'(<h2 class="h2"[^>]*>Important Information</h2>\s*)<div>.*?</div>(\s*</div>\s*</div>\s*</div>\s*</section>)'
new_content = re.sub(pattern, r'\g<1>' + new_info + r'\g<2>', content, flags=re.DOTALL)

with open("product-biscamaze-lf.html", "w", encoding="utf-8") as f:
    f.write(new_content)
