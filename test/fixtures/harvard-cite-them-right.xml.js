export default `<?xml version="1.0" encoding="utf-8"?>
<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" demote-non-dropping-particle="sort-only" default-locale="en-GB">
  <info>
    <title>Cite Them Right 12th edition - Harvard</title>
    <id>http://www.zotero.org/styles/harvard-cite-them-right</id>
    <link href="http://www.zotero.org/styles/harvard-cite-them-right" rel="self"/>
    <link href="http://www.zotero.org/styles/harvard-cite-them-right-11th-edition" rel="template"/>
    <link href="http://www.citethemrightonline.com/" rel="documentation"/>
    <author>
      <name>Patrick O'Brien</name>
    </author>
    <category citation-format="author-date"/>
    <category field="generic-base"/>
    <summary>Harvard according to Cite Them Right, 11th edition.</summary>
    <updated>2022-06-29T02:44:10+00:00</updated>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
  </info>
  <locale xml:lang="en-GB">
    <terms>
      <term name="editor" form="short">
        <single>ed.</single>
        <multiple>eds</multiple>
      </term>
      <term name="editortranslator" form="verb">edited and translated by</term>
      <term name="edition" form="short">edn.</term>
    </terms>
  </locale>
  <macro name="editor">
    <choose>
      <if type="chapter paper-conference" match="any">
        <names variable="container-author" delimiter=", " suffix=", ">
          <name and="text" initialize-with=". " delimiter=", " sort-separator=", " name-as-sort-order="all"/>
        </names>
        <choose>
          <if variable="container-author" match="none">
            <names variable="editor translator" delimiter=", ">
              <name and="text" initialize-with="."/>
              <label form="short" prefix=" (" suffix=")"/>
            </names>
          </if>
        </choose>
      </if>
    </choose>
  </macro>
  <macro name="secondary-contributors">
    <choose>
      <if type="chapter paper-conference" match="none">
        <names variable="editor translator" delimiter=". ">
          <label form="verb" text-case="capitalize-first" suffix=" "/>
          <name and="text" initialize-with="."/>
        </names>
      </if>
      <else-if variable="container-author" match="any">
        <names variable="editor translator" delimiter=". ">
          <label form="verb" text-case="capitalize-first" suffix=" "/>
          <name and="text" initialize-with=". " delimiter=", "/>
        </names>
      </else-if>
    </choose>
  </macro>
  <macro name="author">
    <names variable="author">
      <name and="text" delimiter-precedes-last="never" initialize-with="." name-as-sort-order="all"/>
      <label form="short" prefix=" (" suffix=")"/>
      <et-al font-style="italic"/>
      <substitute>
        <names variable="editor"/>
        <names variable="translator"/>
        <choose>
          <if type="article-newspaper article-magazine" match="any">
            <text variable="container-title" text-case="title" font-style="italic"/>
          </if>
          <else>
            <text macro="title"/>
          </else>
        </choose>
      </substitute>
    </names>
  </macro>
  <macro name="author-short">
    <names variable="author">
      <name form="short" and="text" delimiter=", " delimiter-precedes-last="never" initialize-with=". "/>
      <et-al font-style="italic"/>
      <substitute>
        <names variable="editor"/>
        <names variable="translator"/>
        <choose>
          <if type="article-newspaper article-magazine" match="any">
            <text variable="container-title" text-case="title" font-style="italic"/>
          </if>
          <else>
            <text macro="title"/>
          </else>
        </choose>
      </substitute>
    </names>
  </macro>
  <macro name="access">
    <choose>
      <if variable="DOI">
        <group delimiter=": ">
          <text term="available at" text-case="capitalize-first"/>
          <text variable="DOI" prefix="https://doi.org/"/>
        </group>
      </if>
      <else-if variable="URL">
        <text term="available at" suffix=": " text-case="capitalize-first"/>
        <text variable="URL"/>
        <group prefix=" (" delimiter=": " suffix=")">
          <text term="accessed" text-case="capitalize-first"/>
          <date form="text" variable="accessed">
            <date-part name="day"/>
            <date-part name="month"/>
            <date-part name="year"/>
          </date>
        </group>
      </else-if>
    </choose>
  </macro>
  <macro name="number-volumes">
    <choose>
      <if variable="volume" match="none">
        <group delimiter=" " prefix="(" suffix=")">
          <text variable="number-of-volumes"/>
          <label variable="volume" form="short" strip-periods="true"/>
        </group>
      </if>
    </choose>
  </macro>
  <macro name="title">
    <choose>
      <if type="bill book legal_case legislation motion_picture report song thesis webpage graphic" match="any">
        <group delimiter=". ">
          <group delimiter=" ">
            <group delimiter=" ">
              <text variable="title" font-style="italic"/>
              <text variable="medium" prefix="[" suffix="]"/>
            </group>
            <text macro="number-volumes"/>
          </group>
          <text macro="edition"/>
        </group>
      </if>
      <else>
        <text variable="title" form="long" quotes="true"/>
      </else>
    </choose>
  </macro>
  <macro name="publisher">
    <choose>
      <if type="thesis">
        <group delimiter=". ">
          <text variable="genre"/>
          <text variable="publisher"/>
        </group>
      </if>
      <else-if type="report">
        <group delimiter=". ">
          <group delimiter=" ">
            <text variable="genre"/>
            <text variable="number"/>
          </group>
          <group delimiter=": ">
            <text variable="publisher-place"/>
            <text variable="publisher"/>
          </group>
        </group>
      </else-if>
      <else-if type="article-journal article-newspaper article-magazine" match="none">
        <group delimiter=" ">
          <group delimiter=", ">
            <choose>
              <if type="speech" variable="event" match="any">
                <text variable="event" font-style="italic"/>
              </if>
            </choose>
            <group delimiter=": ">
              <text variable="publisher-place"/>
              <text variable="publisher"/>
            </group>
          </group>
          <group prefix="(" suffix=")" delimiter=", ">
            <text variable="collection-title"/>
            <text variable="collection-number"/>
          </group>
        </group>
      </else-if>
    </choose>
  </macro>
  <macro name="year-date">
    <choose>
      <if variable="issued">
        <date variable="issued">
          <date-part name="year"/>
        </date>
        <text variable="year-suffix"/>
      </if>
      <else>
        <text term="no date"/>
        <text variable="year-suffix" prefix=" "/>
      </else>
    </choose>
  </macro>
  <macro name="locator">
    <choose>
      <if type="article-journal">
        <text variable="volume"/>
        <text variable="issue" prefix="(" suffix=")"/>
      </if>
    </choose>
  </macro>
  <macro name="published-date">
    <choose>
      <if type="article-newspaper article-magazine post-weblog speech" match="any">
        <date variable="issued">
          <date-part name="day" suffix=" "/>
          <date-part name="month" form="long"/>
        </date>
      </if>
    </choose>
  </macro>
  <macro name="pages">
    <choose>
      <if type="chapter paper-conference article-journal article article-magazine article-newspaper book review review-book report" match="any">
        <group delimiter=" ">
          <label variable="page" form="short"/>
          <text variable="page"/>
        </group>
      </if>
    </choose>
  </macro>
  <macro name="container-title">
    <choose>
      <if variable="container-title">
        <group delimiter=". ">
          <group delimiter=" ">
            <text variable="container-title" font-style="italic"/>
            <choose>
              <if type="article article-journal" match="any">
                <choose>
                  <if match="none" variable="page volume">
                    <text value="Preprint" prefix="[" suffix="]"/>
                  </if>
                </choose>
              </if>
            </choose>
          </group>
          <text macro="edition"/>
        </group>
      </if>
    </choose>
  </macro>
  <macro name="edition">
    <choose>
      <if is-numeric="edition">
        <group delimiter=" ">
          <number variable="edition" form="ordinal"/>
          <text term="edition" form="short" strip-periods="true"/>
        </group>
      </if>
      <else>
        <text variable="edition"/>
      </else>
    </choose>
  </macro>
  <macro name="container-prefix">
    <choose>
      <if type="chapter paper-conference" match="any">
        <text term="in"/>
      </if>
    </choose>
  </macro>
  <citation et-al-min="4" et-al-use-first="1" disambiguate-add-year-suffix="true" disambiguate-add-names="true" disambiguate-add-givenname="true" collapse="year">
    <sort>
      <key macro="year-date"/>
    </sort>
    <layout prefix="(" suffix=")" delimiter="; ">
      <group delimiter=", ">
        <group delimiter=", ">
          <text macro="author-short"/>
          <text macro="year-date"/>
        </group>
        <group>
          <label variable="locator" form="short" suffix=" "/>
          <text variable="locator"/>
        </group>
      </group>
    </layout>
  </citation>
  <bibliography and="text" et-al-min="4" et-al-use-first="1">
    <sort>
      <key macro="author"/>
      <key macro="year-date"/>
      <key variable="title"/>
    </sort>
    <layout suffix=".">
      <group delimiter=". ">
        <group delimiter=" ">
          <text macro="author"/>
          <text macro="year-date" prefix="(" suffix=")"/>
          <group delimiter=", ">
            <text macro="title"/>
            <group delimiter=" ">
              <text macro="container-prefix"/>
              <text macro="editor"/>
              <text macro="container-title"/>
            </group>
          </group>
        </group>
        <text macro="secondary-contributors"/>
        <text macro="publisher"/>
      </group>
      <group delimiter=", " prefix=", ">
        <text macro="locator"/>
        <text macro="published-date"/>
        <text macro="pages"/>
      </group>
      <text macro="access" prefix=". "/>
    </layout>
  </bibliography>
</style>`;
