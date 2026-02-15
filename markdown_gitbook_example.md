# Materials

## Applying Material

To distinguish between different wood species and types of materials, a **Material** must be applied to the components. A texture representing the actual material can be used, but this remains optional, as plain colors (including white) are sufficient.

{% hint style="info" %}
If you have already defined a SketchUp material and maybe even applied it to your components, the material will automatically appear in the **Materials** section of OpenCutList, although it will not have any specific configuration.
{% endhint %}

{% hint style="success" %}
**OpenCutList** will allow you to add a material and configure it directly, without having to first create it in SketchUp and then configure it.
{% endhint %}

## Material Types

{% hint style="success" %}

Solid wood can be rough lumber or any lumber that will be ripped and planed to thickness. In addition to length and width oversize, a thickness oversize can be configured to account for warped, irregular boards. Soft or hardwood lumber is usually available in standard thicknesses (real, not nominal).

{% endhint %}

An **OpenCutList** material is a SketchUp material with a few additional attributes. **OpenCutList** defines the following five types of materials:

1. [**Solid Wood**](#solid-wood) is rough lumber, usually available in specific thicknesses, but not in standardized lengths or widths. Because it may have defects (knots, cracks, discoloration, …), it is up to the woodworker to carefully choose the location of the parts inside such a material.
2. [**Sheet Good**](#sheet-good) is lumber coming in sheets (MDF, Plywood, OSB, …). Such a material is not meant to be planed, just cut. It is a fairly homogeneous material where grain direction may (Plywood, OSB) or may not be important (MDF).
3. [**Dimensional** ](#dimensional)is lumber coming in standardized cross sections and standardized lengths. Typically, such a material is only cut to length. Consider it as carpentry/construction lumber. If we were to use this wood for cheap furniture, we would make it **Solid Wood**, since we would probably rip and/or plane it first.
4. [**Veneer** ](#veneer)is a thin slice, in general of valuable wood, that is applied onto panels to obtain a nicer looking surface.
5. [**Edge Banding**](#edge-banding) is a thin strip of material applied to the edges of parts made from less valuable core material like MDF or Plywood, to increase the durability of exposed edges and to make them look nicer.
6. [**Hardware** ](#hardware)is an accessory like a hinge, a drawer slide or pull, or any other non-wooden part.

You can apply a material to a component definition, by opening the component and applying the material to all its faces, or just by applying material to the selected instance. In the latter case, components with the same definition may have different material applied to them.

{% hint style="success" %}
If you apply material to a group of components, **OpenCutList** will consider that all components have the specified material, if they do not already have a material. If you later ungroup the components, they will simply retain the material that was applied to the group. In this respect, **OpenCutList** behaves like SketchUp.

This behavior will be deactivated if you unselect "Smart Assignment..." in  [Options for Parts](https://docs.opencutlist.org/parts/options#smart-assignment-of-material).
{% endhint %}

{% hint style="warning" %}
If you apply a material to only specific faces of a component, **OpenCutList** will consider this to be the material of the component (but only if "Smart Assignment..." has been selected in [Options for Parts](https://docs.opencutlist.org/parts/options#smart-assignment-of-material)).
{% endhint %}

## Configuring Materials

Materials must be configured to help **OpenCutList** produce the **Part List**. Each material type (as defined above) has its own specific set of configuration options. A material has a **name**, a **color** and a **type**. The name can describe a whole set of material. MDF, for instance, which is available in multiple thicknesses and sheet sizes, can be configured as a single material.

{% hint style="success" %}
Once configured, the material can be exported to a `*.skm` file or a SketchUp collection, see [Materials](#saving-and-importing-material). The configured material can also be set as a default preset.*
{% endhint %}

### Solid Wood

Solid wood can be rough lumber or any lumber that will be ripped and planed to thickness. In addition to **length** and **width oversize**, a **thickness oversize** can be configured to account for warped, irregular boards. Soft or hardwood lumber is usually available in **standard thicknesses** (real, not nominal).

### Sheet Good

Sheet goods like MDF, Plywood and OSB are available in various sizes and thicknesses. A single material can describe all variants.

- a **length** and a **width oversize** can be applied to each part to be placed onto a panel.
- a **standard thickness** (multiple values possible) in real dimension (not nominal).
- a **standard size of the sheets** (multiple values possible) in real dimensions (not nominal). The first dimension is length *by convention*, the second dimension is width.
- presence or absence of a **grain direction**. Grain direction always runs along the length, i.e. the first dimension of the panel.

### Dimensional

Dimensional lumber is often used in construction. It is characterized by a **standard section** (width x thickness, multiple values) and available in **standard lengths**. A **length oversize** parameter can be set to account for rough dimensions.

### Veneer

Veneer has a **thickness**, a **length** and **width oversize** and may have a **grain direction**. It usually comes in sheets.

### Edge Banding

Edge Banding has a **thickness**, a **length oversize** and a **standard length** (multiple values possible). It is also available in **standard width** (multiple values possible).

**Reduce** applies to the dimension of the part the edge banding is applied to. When **No Reduction** is selected, the part will not be trimmed. If **Reduce by Edge Banding Thickness** is selected, the part's dimension will be reduced by the thickness of the edge banding.

### Common Attributes

**Density** and **Price** may be configured for all four types of materials. These values are used in **Reports**, to calculate the weight and price of the raw material needed for a project.

### Hardware

**Hardware** is handled quite differently from the other types of material, because there are no parameters to configure here. For each type of hardware you will use, add a distinct material. For example, *dominos* to use Dominos. Now you can assign this material to any component and **OpenCutList** will consider this component to be a Domino and list all components of this type in a same group. Edit the properties of each part to add **Packaging**, **Price** and **Weight** if you want to use the **Report** feature.

By drawing simple dowels and assigning the material *dominos*, OpenCutList will provide you with the total number of Dominos needed for the project. If you buy your Dominos in packs of 1000, but you only need 80, OpenCutList will inform you that 920 will not be used.

## Adding and Configuring Textures

Textures can be added from SketchUp or directly from **OpenCutList**. The tab Texture of the properties of a material lets you select a texture picture.

{% hint style="info" %}
This feature was introduced in version 5.0.0. Before, textures had to be added using SketchUp.
{% endhint %}

Textures can be rotated in 90° steps and their width and height can be defined.

<figure><img src="https://2764382921-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MUSHuV5bThAGZxy7OHb-1972196547%2Fuploads%2FSzty3bFUixyVRpn2MEWl%2FMaterials%20-%20Texture.png?alt=media&#x26;token=b3ec5ea4-9cae-43fd-96c6-73fd71b4dcad" alt="" width="563"><figcaption><p>Textures in OpenCutList</p></figcaption></figure>

## Saving and Importing Material

You may save the configured material for use in future projects. **OpenCutList** lets you export each material to its own file with extension **.skm**. So, you can use the same material (including all parameters associated with it) in another model.

{% hint style="info" %}
**OpenCutList** will save the material in a subfolder of your profile, so that it can be reused in another project or shared with other users.
{% endhint %}

{% hint style="warning" %}
If you import a material with the same name as a material already present in the folder, the import will be silently ignored (which is SketchUp's behavior).
{% endhint %}

## Duplicating Material

To duplicate a given material (including its **OpenCutList** attributes), open the **Properties of Material** window and click on **Duplicate**. Enter a new name for the copy. If you don't change the name, a new unique name based on the old name will be given.

## Removing Material

You may directly delete a material from **OpenCutList**.&#x20;

{% hint style="warning" %}
Removing a material from the **OpenCutList** Materials tab will also remove it from the SketchUp model and apply the default material to all parts which had the deleted material.
{% endhint %}

## Purging Unused Material

You may also purge unused material similarly to `Window -> Model Info -> Statistics`. However since the extension relies on a SketchUp function, if an unused material is currently selected in the material tray, **OpenCutList** cannot delete it.

---

{% hint style="info" %}
**OpenCutList** will save the material in a *subfolder* of your profile, so that it can be `reused` in another project.
{% endhint %}


<style>
.hint-box {
  padding: 15px;
  border-left: 5px solid;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  margin: 10px 0;
  transform: translateY(20px);
  opacity: 0;
  animation: slideFadeIn 0.6s forwards;
}

@keyframes slideFadeIn {
  to { transform: translateY(0); opacity: 1; }
}

.hint-info { background-color: #1565C0; border-color: #0D47A1; }
.hint-warning { background-color: #FF6F00; border-color: #E65100; }
.hint-success { background-color: #2E7D32; border-color: #1B5E20; }
.hint-error { background-color: #B71C1C; border-color: #7F0000; }
.hint-tip { background-color: #283593; border-color: #1A237E; }
.hint-slate { background-color: #37474F; border-color: #263238; }
.hint-teal { background-color: #00695C; border-color: #004D40; }
.hint-purple { background-color: #6A1B9A; border-color: #4A148C; }
.hint-dark { background-color: #263238; border-color: #0288D1; color: #B0BEC5; }
.hint-gradient { 
  background: linear-gradient(135deg,#1E88E5,#00ACC1); 
  border-color: #1E88E5;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
</style>

<div class="hint-box hint-info"><strong>Info:</strong> Animated info hint.</div>
<div class="hint-box hint-warning"><strong>Warning:</strong> Animated warning hint.</div>
<div class="hint-box hint-success"><strong>Success:</strong> Animated success hint.</div>
<div class="hint-box hint-error"><strong>Error:</strong> Animated error hint.</div>
<div class="hint-box hint-tip"><strong>Tip:</strong> Animated tip hint.</div>
<div class="hint-box hint-slate"><strong>Reminder:</strong> Animated slate hint.</div>
<div class="hint-box hint-teal"><strong>Highlight:</strong> Animated teal hint.</div>
<div class="hint-box hint-purple"><strong>Note:</strong> Animated purple hint.</div>
<div class="hint-box hint-dark"><strong>Info:</strong> Dark mode animated hint.</div>
<div class="hint-box hint-gradient"><strong>Modern:</strong> Gradient animated hint.</div>
<style>
.hint-box {
  padding: 15px;
  border-left: 5px solid;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  margin: 12px 0;
  transform: translateY(20px);
  opacity: 0;
  animation: slideFadePulse 0.8s forwards;
  transition: box-shadow 0.3s;
}

/* Slide + Fade + subtle glow */
@keyframes slideFadePulse {
  0% { transform: translateY(20px); opacity: 0; box-shadow: 0 0 0 rgba(0,0,0,0); }
  50% { transform: translateY(0); opacity: 1; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
  100% { transform: translateY(0); opacity: 1; box-shadow: 0 0 4px rgba(0,0,0,0.05); }
}

/* Optional subtle pulsing glow on hover */
.hint-box:hover {
  box-shadow: 0 0 12px rgba(0,0,0,0.2);
}

/* Styles */
.hint-info { background-color: #1565C0; border-color: #0D47A1; }
.hint-warning { background-color: #FF6F00; border-color: #E65100; }
.hint-success { background-color: #2E7D32; border-color: #1B5E20; }
.hint-error { background-color: #B71C1C; border-color: #7F0000; }
.hint-tip { background-color: #283593; border-color: #1A237E; }
.hint-slate { background-color: #37474F; border-color: #263238; }
.hint-teal { background-color: #00695C; border-color: #004D40; }
.hint-purple { background-color: #6A1B9A; border-color: #4A148C; }
.hint-dark { background-color: #263238; border-color: #0288D1; color: #B0BEC5; }
.hint-gradient { 
  background: linear-gradient(135deg,#1E88E5,#00ACC1); 
  border-color: #1E88E5;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
</style>

<div class="hint-box hint-info"><strong>Info:</strong> Animated info hint with pulse effect.</div>
<div class="hint-box hint-warning"><strong>Warning:</strong> Animated warning hint with glow.</div>
<div class="hint-box hint-success"><strong>Success:</strong> Animated success hint with pulse.</div>
<div class="hint-box hint-error"><strong>Error:</strong> Animated error hint with glow.</div>
<div class="hint-box hint-tip"><strong>Tip:</strong> Animated tip with subtle pulse.</div>
<div class="hint-box hint-slate"><strong>Reminder:</strong> Slate hint with animation.</div>
<div class="hint-box hint-teal"><strong>Highlight:</strong> Teal hint with hover glow.</div>
<div class="hint-box hint-purple"><strong>Note:</strong> Purple animated hint.</div>
<div class="hint-box hint-dark"><strong>Info:</strong> Dark mode animated hint.</div>
<div class="hint-box hint-gradient"><strong>Modern:</strong> Gradient hint with animated entrance.</div>
